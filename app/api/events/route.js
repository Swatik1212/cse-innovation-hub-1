import { db } from "@/database/db";
import { verifySession } from "@/lib/session";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM events ORDER BY event_date ASC");
    return Response.json(rows);
  } catch (error) {
    console.error("API Error:", error);
    return Response.json({ error: error.message }, { status: 500 });
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
