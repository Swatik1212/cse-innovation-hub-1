import { db } from "@/database/db"
import { verifySession } from "@/lib/session"

export async function GET() {
  try {
    const [rows] = await db.query(
      "SELECT p.id, p.title, p.description, p.status, u.full_name AS student_name FROM projects p LEFT JOIN users u ON p.student_id = u.id ORDER BY p.id DESC"
    )
    const result = rows.map((r) => ({
      id: String(r.id),
      title: r.title,
      description: r.description || "",
      status: r.status || "proposed",
      studentName: r.student_name || "",
    }))
    return Response.json(result)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const pair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = pair ? pair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { title, description = "" } = await req.json()
    if (!title) return Response.json({ error: "Title required" }, { status: 400 })
    const [res] = await db.execute(
      "INSERT INTO projects (title, student_id, description, status) VALUES (?, ?, ?, 'proposed')",
      [title, Number(payload.uid), description]
    )
    return Response.json({ id: res.insertId }, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req) {
  try {
    const cookie = req.headers.get("cookie") || ""
    const pair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = pair ? pair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload || payload.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }
    const { id, status } = await req.json()
    if (!id || !status) return Response.json({ error: "Missing fields" }, { status: 400 })
    await db.execute("UPDATE projects SET status = ? WHERE id = ?", [status, Number(id)])
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

