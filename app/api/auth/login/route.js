import { db } from "@/database/db"
import { cookieHeaderForSession } from "@/lib/session"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return Response.json({ error: "Email and password required" }, { status: 400 })
    }
    const normalizedEmail = String(email).trim().toLowerCase()
    let [rows] = await db.query("SELECT id, full_name, email, role, password_hash FROM users WHERE email = ?", [normalizedEmail])

    if (!rows.length && normalizedEmail === "admin@csehub.com") {
      const adminPass = process.env.ADMIN_PASSWORD || "admin123"
      const hash = await bcrypt.hash(adminPass, 10)
      const [res] = await db.execute(
        "INSERT INTO users (full_name, email, password_hash, role) VALUES (?, ?, ?, 'admin')",
        ["System Admin", normalizedEmail, hash]
      )
      rows = [{ id: res.insertId, full_name: "System Admin", email: normalizedEmail, role: "admin", password_hash: hash }]
    }

    if (!rows.length) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const user = rows[0]
    const ok = user.password_hash && (await bcrypt.compare(password, user.password_hash))
    if (!ok) {
      return Response.json({ error: "Invalid credentials" }, { status: 401 })
    }
    const payload = {
      uid: String(user.id),
      email: user.email,
      role: user.role || (String(user.email).toLowerCase() === "admin@csehub.com" ? "admin" : "student"),
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7,
    }
    const headers = { "Set-Cookie": cookieHeaderForSession(payload) }
    return new Response(JSON.stringify({ id: String(user.id), name: user.full_name, email: user.email, role: payload.role }), {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("Login error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
