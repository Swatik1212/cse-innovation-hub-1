import { db } from "@/database/db"
import { verifySession } from "@/lib/session"
import { placementResources as mockPlacements } from "@/lib/data"

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const category = url.searchParams.get("category")
    const q = url.searchParams.get("q")
    const page = Math.max(1, Number(url.searchParams.get("page") || 1))
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 20)))
    const offset = (page - 1) * limit

    const where = []
    const params = []
    if (category && category !== "all") {
      where.push("category = ?")
      params.push(category)
    }
    if (q) {
      where.push("(title LIKE ? OR description LIKE ?)")
      params.push(`%${q}%`, `%${q}%`)
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : ""

    const [rows] = await db.query(
      `SELECT id, title, description, category, link, download_url FROM placements ${whereSql} ORDER BY id ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM placements ${whereSql}`,
      params
    )
    const total = Number((countRows && countRows[0] && countRows[0].total) || 0)

    const result = rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      category: r.category,
      description: r.description,
      link: r.link || undefined,
      downloadUrl: r.download_url || undefined,
    }))

    return Response.json(result, { headers: { 'X-Total-Count': String(total) } })
  } catch (error) {
    try {
      const result = mockPlacements.map((r) => ({
        id: String(r.id),
        title: r.title,
        category: r.category,
        description: r.description,
        link: r.link || undefined,
        downloadUrl: r.downloadUrl || undefined,
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
    let { title, description, category, link = null, download_url = null } = body || {}

    const cookie = req.headers.get("cookie") || ""
    const sessionPair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = sessionPair ? sessionPair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload || payload.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!title || !description || !category) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (link !== null) {
      const v = String(link).trim()
      if (v === "") {
        link = null
      } else {
        if (!/^https?:\/\//i.test(v)) {
          return Response.json({ error: "link must start with http:// or https://" }, { status: 400 })
        }
        try {
          const u = new URL(v)
          if (!/^https?:$/i.test(u.protocol)) {
            return Response.json({ error: "link must use http/https" }, { status: 400 })
          }
          const blocked = new Set(["example.com", "www.example.com"]) 
          if (blocked.has(u.hostname) || /\.example$/i.test(u.hostname) || /^example$/i.test(u.hostname)) {
            return Response.json({ error: "link host is not allowed" }, { status: 400 })
          }
        } catch {
          return Response.json({ error: "link is not a valid URL" }, { status: 400 })
        }
        link = v
      }
    }
    if (download_url !== null) {
      const v = String(download_url).trim()
      if (v === "") {
        download_url = null
      } else {
        if (!/^https?:\/\//i.test(v)) {
          return Response.json({ error: "download_url must start with http:// or https://" }, { status: 400 })
        }
        try {
          const u = new URL(v)
          if (!/^https?:$/i.test(u.protocol)) {
            return Response.json({ error: "download_url must use http/https" }, { status: 400 })
          }
          const blocked = new Set(["example.com", "www.example.com"]) 
          if (blocked.has(u.hostname) || /\.example$/i.test(u.hostname) || /^example$/i.test(u.hostname)) {
            return Response.json({ error: "download_url host is not allowed" }, { status: 400 })
          }
        } catch {
          return Response.json({ error: "download_url is not a valid URL" }, { status: 400 })
        }
        download_url = v
      }
    }

    const [res] = await db.execute(
      "INSERT INTO placements (title, description, category, link, download_url) VALUES (?, ?, ?, ?, ?)",
      [title, description, category, link, download_url]
    )
    return Response.json({ id: res.insertId }, { status: 201 })
  } catch (error) {
    console.error("API Error (placements):", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const sessionPair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = sessionPair ? sessionPair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload || payload.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const { id, title, description, category, link, download_url } = body || {}
    const pid = Number(id)
    if (!pid || Number.isNaN(pid)) {
      return Response.json({ error: "Invalid id" }, { status: 400 })
    }

    const updates = []
    const params = []
    if (title !== undefined) {
      updates.push("title = ?")
      params.push(title)
    }
    if (description !== undefined) {
      updates.push("description = ?")
      params.push(description)
    }
    if (category !== undefined) {
      updates.push("category = ?")
      params.push(category)
    }
    if (link !== undefined) {
      const v = (link || "").trim()
      if (v === "") {
        updates.push("link = ?")
        params.push(null)
      } else {
        if (!/^https?:\/\//i.test(v)) {
          return Response.json({ error: "link must start with http:// or https://" }, { status: 400 })
        }
        try {
          const u = new URL(v)
          if (!/^https?:$/i.test(u.protocol)) {
            return Response.json({ error: "link must use http/https" }, { status: 400 })
          }
          const blocked = new Set(["example.com", "www.example.com"]) 
          if (blocked.has(u.hostname)) {
            return Response.json({ error: "link host is not allowed" }, { status: 400 })
          }
        } catch {
          return Response.json({ error: "link is not a valid URL" }, { status: 400 })
        }
        updates.push("link = ?")
        params.push(v)
      }
    }
    if (download_url !== undefined) {
      const v = (download_url || "").trim()
      if (v === "") {
        updates.push("download_url = ?")
        params.push(null)
      } else {
        if (!/^https?:\/\//i.test(v)) {
          return Response.json({ error: "download_url must start with http:// or https://" }, { status: 400 })
        }
        try {
          const u = new URL(v)
          if (!/^https?:$/i.test(u.protocol)) {
            return Response.json({ error: "download_url must use http/https" }, { status: 400 })
          }
        } catch {
          return Response.json({ error: "download_url is not a valid URL" }, { status: 400 })
        }
        updates.push("download_url = ?")
        params.push(v)
      }
    }

    if (!updates.length) {
      return Response.json({ error: "No fields to update" }, { status: 400 })
    }
    await db.execute(`UPDATE placements SET ${updates.join(", ")} WHERE id = ?`, [...params, pid])
    return Response.json({ id: pid }, { status: 200 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
