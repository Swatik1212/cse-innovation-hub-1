import { db } from "@/database/db"
import { verifySession } from "@/lib/session"

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT id, title, description, category, link, download_url FROM placements ORDER BY id ASC"
    )

    const result = rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      category: r.category,
      description: r.description,
      link: r.link || undefined,
      downloadUrl: r.download_url || undefined,
    }))

    return Response.json(result)
  } catch (error) {
    console.error("API Error (placements):", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { title, description, category, link = null, download_url = null } = body || {}

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
