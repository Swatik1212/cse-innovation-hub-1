import { db } from "@/database/db"
import bcrypt from "bcryptjs"
import { verifySession, cookieHeaderForSession } from "@/lib/session"

export async function POST(req) {
  try {
    const { current_password, new_password } = await req.json()
    if (!current_password || !new_password) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (new_password.length < 6) {
      return Response.json({ error: "Password too short" }, { status: 400 })
    }
    const cookie = req.headers.get("cookie") || ""
    const pair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = pair ? pair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }
    const [rows] = await db.query("SELECT id, email, role, password_hash FROM users WHERE id = ?", [payload.uid])
    if (!rows.length) {
      return Response.json({ error: "User not found" }, { status: 404 })
    }
    const user = rows[0]
    const ok = user.password_hash && (await bcrypt.compare(current_password, user.password_hash))
    if (!ok) {
      return Response.json({ error: "Invalid current password" }, { status: 401 })
    }
    const hash = await bcrypt.hash(new_password, 10)
    await db.execute("UPDATE users SET password_hash = ? WHERE id = ?", [hash, user.id])
    const newPayload = {
      uid: String(user.id),
      email: user.email,
      role: user.role,
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }
    const headers = { "Set-Cookie": cookieHeaderForSession(newPayload) }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

