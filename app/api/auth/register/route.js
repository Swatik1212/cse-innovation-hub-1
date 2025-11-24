import { db } from "@/database/db"
import bcrypt from "bcryptjs"

export async function POST(req) {
  try {
    const { full_name, email, password, course = null, year_of_study = null } = await req.json()
    if (!full_name || !email || !password) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }
    const normalizedEmail = String(email).trim().toLowerCase()
    const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [normalizedEmail])
    if (existing.length) {
      return Response.json({ error: "Email already registered" }, { status: 409 })
    }
    const role = normalizedEmail === "admin@csehub.com" ? "admin" : "student"
    const hash = await bcrypt.hash(password, 10)
    const [res] = await db.execute(
      "INSERT INTO users (full_name, email, password_hash, course, year_of_study, role) VALUES (?, ?, ?, ?, ?, ?)",
      [full_name, normalizedEmail, hash, course, year_of_study, role]
    )
    return Response.json({ id: res.insertId, role }, { status: 201 })
  } catch (error) {
    console.error("Register error:", error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
