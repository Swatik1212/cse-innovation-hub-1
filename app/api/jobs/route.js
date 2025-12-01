import { db } from "@/database/db"
import { verifySession } from "@/lib/session"
import { jobs as mockJobs } from "@/lib/data"

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get("type")
    const company = url.searchParams.get("company")
    const q = url.searchParams.get("q")
    const page = Math.max(1, Number(url.searchParams.get("page") || 1))
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 20)))
    const offset = (page - 1) * limit

    const where = []
    const params = []
    if (type && type !== "all") {
      where.push("type = ?")
      params.push(type)
    }
    if (company) {
      where.push("company LIKE ?")
      params.push(`%${company}%`)
    }
    if (q) {
      where.push("(position LIKE ? OR company LIKE ? OR description LIKE ?)")
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : ""

    const [jobs] = await db.query(
      `SELECT id, title, company, position, type, location, salary, description, DATE_FORMAT(posted_date, '%Y-%m-%d') AS posted_date_str, apply_link FROM jobs ${whereSql} ORDER BY posted_date DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM jobs ${whereSql}`,
      params
    )
    const total = Number((countRows && countRows[0] && countRows[0].total) || 0)

    const ids = jobs.map((j) => j.id)
    let reqs = []
    if (ids.length) {
      const [rows] = await db.query(
        `SELECT job_id, requirement FROM job_requirements WHERE job_id IN (${ids.map(() => '?').join(',')}) ORDER BY id ASC`,
        ids
      )
      reqs = rows
    }

    const reqMap = new Map()
    for (const r of reqs) {
      const list = reqMap.get(r.job_id) || []
      list.push(r.requirement)
      reqMap.set(r.job_id, list)
    }

    const result = jobs.map((j) => ({
      id: String(j.id),
      company: j.company,
      position: j.position,
      type: j.type,
      location: j.location,
      salary: j.salary,
      description: j.description,
      requirements: reqMap.get(j.id) || [],
      postedDate: j.posted_date_str || "",
      applyLink: j.apply_link || "",
    }))

    return Response.json(result, { headers: { 'X-Total-Count': String(total) } })
  } catch (error) {
    try {
      const result = mockJobs.map((j) => ({
        id: String(j.id),
        company: j.company,
        position: j.position,
        type: j.type,
        location: j.location,
        salary: j.salary,
        description: j.description,
        requirements: j.requirements || [],
        postedDate: j.postedDate,
        applyLink: "",
      }))
      return Response.json(result)
    } catch {
      return Response.json({ error: error.message }, { status: 500 })
    }
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      company,
      position,
      type,
      location = "",
      salary = "",
      description = "",
      posted_date,
      apply_link = "",
      requirements = [],
    } = body || {}

    const cookie = req.headers.get("cookie") || ""
    const sessionPair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = sessionPair ? sessionPair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload || payload.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!company || !position || !type) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    let normalizedApply = apply_link
    if (normalizedApply && typeof normalizedApply === "string") {
      normalizedApply = normalizedApply.trim()
      if (!/^https?:\/\//i.test(normalizedApply)) {
        return Response.json({ error: "apply_link must start with http:// or https://" }, { status: 400 })
      }
      try {
        const u = new URL(normalizedApply)
        if (!/^https?:$/i.test(u.protocol)) {
          return Response.json({ error: "apply_link must use http/https" }, { status: 400 })
        }
        const blocked = new Set(["example.com", "company.com", "www.example.com", "www.company.com"])
        if (blocked.has(u.hostname) || /\.example$/i.test(u.hostname) || /^example$/i.test(u.hostname)) {
          return Response.json({ error: "apply_link host is not allowed" }, { status: 400 })
        }
        if (normalizedApply.length > 2048) {
          return Response.json({ error: "apply_link too long" }, { status: 400 })
        }
      } catch {
        return Response.json({ error: "apply_link is not a valid URL" }, { status: 400 })
      }
    }

    const [jobRes] = await db.execute(
      "INSERT INTO jobs (title, company, position, type, location, salary, description, posted_date, apply_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [position, company, position, type, location, salary, description, posted_date || null, normalizedApply || null]
    )

    const jobId = jobRes.insertId
    if (Array.isArray(requirements) && requirements.length > 0) {
      for (const r of requirements) {
        if (r && r.trim()) {
          await db.execute("INSERT INTO job_requirements (job_id, requirement) VALUES (?, ?)", [jobId, r.trim()])
        }
      }
    }

    return Response.json({ id: jobId }, { status: 201 })
  } catch (error) {
    console.error("API Error (jobs):", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
