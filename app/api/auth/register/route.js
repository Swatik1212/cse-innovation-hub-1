import { db } from '@/database/db'
import bcrypt from 'bcryptjs'

export async function POST(req) {
  try {
  const { full_name, email, password, course, year_of_study } = await req.json()
  const hashed = await bcrypt.hash(password, 10)
  const [res] = await db.execute(
      "INSERT INTO users (full_name, email, password_hash, course, year_of_study, role) VALUES (?, ?, ?, ?, ?, 'student')",
      [full_name, String(email).trim().toLowerCase(), hashed, course || null, year_of_study || null]
    )
    return new Response(
      JSON.stringify({ id: res.insertId, full_name, email: String(email).trim().toLowerCase() }),
      { status: 201 }
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
