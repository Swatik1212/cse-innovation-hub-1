import { db } from "@/database/db"
import { verifySession } from "@/lib/session"

export async function GET() {
  try {
    const [jobs] = await db.query(
      "SELECT id, title, company, position, type, location, salary, description, DATE_FORMAT(posted_date, '%Y-%m-%d') AS posted_date_str, apply_link FROM jobs ORDER BY posted_date DESC"
    )

    const [reqs] = await db.query(
      "SELECT job_id, requirement FROM job_requirements ORDER BY id ASC"
    )

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

    return Response.json(result)
  } catch (error) {
    console.error("API Error (jobs):", error)
    return Response.json({ error: error.message }, { status: 500 })
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

    const [jobRes] = await db.execute(
      "INSERT INTO jobs (title, company, position, type, location, salary, description, posted_date, apply_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [position, company, position, type, location, salary, description, posted_date || null, apply_link]
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
