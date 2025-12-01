import { db } from "@/database/db";
import { verifySession } from "@/lib/session";
import { events as mockEvents } from "@/lib/data";

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const type = url.searchParams.get("event_type")
    const status = url.searchParams.get("status")
    const q = url.searchParams.get("q")
    const page = Math.max(1, Number(url.searchParams.get("page") || 1))
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 20)))
    const offset = (page - 1) * limit

    const where = []
    const params = []
    if (type && type !== "all") {
      where.push("event_type = ?")
      params.push(type)
    }
    if (status && status !== "all") {
      where.push("status = ?")
      params.push(status)
    }
    if (q) {
      where.push("(title LIKE ? OR description LIKE ? OR location LIKE ?)")
      params.push(`%${q}%`, `%${q}%`, `%${q}%`)
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : ""

    const [rows] = await db.query(
      `SELECT id, title, description, DATE_FORMAT(event_date, '%Y-%m-%d') AS event_date_str, event_time, location, event_type, status, organizer FROM events ${whereSql} ORDER BY event_date ASC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    )
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS total FROM events ${whereSql}`,
      params
    )
    const total = Number((countRows && countRows[0] && countRows[0].total) || 0)
    const result = rows.map((r) => ({
      id: Number(r.id),
      title: r.title,
      description: r.description,
      event_date: r.event_date_str,
      event_time: r.event_time,
      location: r.location,
      event_type: r.event_type,
      status: r.status,
      organizer: r.organizer,
    }))
    return Response.json(result, { headers: { 'X-Total-Count': String(total) } })
  } catch (error) {
    try {
      const mapped = mockEvents.map((e) => ({
        id: Number(e.id),
        title: e.title,
        description: e.description,
        event_date: e.date,
        event_time: e.time,
        location: e.location,
        event_type: e.type,
        status: e.status,
        organizer: "",
      }))
      return Response.json(mapped)
    } catch {
      return Response.json({ error: error.message }, { status: 500 })
    }
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const {
      title,
      description = "",
      event_date,
      event_time = "",
      location = "",
      event_type,
      status = "Upcoming",
      organizer = "",
    } = body || {}

    if (!title || !event_date || !event_type) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const cookie = req.headers.get("cookie") || ""
    const sessionPair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = sessionPair ? sessionPair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload || payload.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const [result] = await db.execute(
      "INSERT INTO events (title, description, event_date, event_time, location, event_type, status, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, description, event_date, event_time, location, event_type, status, organizer]
    )

    return Response.json({ id: result.insertId }, { status: 201 })
  } catch (error) {
    console.error("API Error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
