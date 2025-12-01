import { db } from "@/database/db"
export const runtime = "nodejs"

export async function GET(req, context) {
  try {
    const params = (context && typeof context.params?.then === "function") ? await context.params : (context?.params || {})
    const id = Number(params?.id)
    if (!id || Number.isNaN(id)) return Response.json({ error: "Invalid job id" }, { status: 400 })
    const [rows] = await db.query("SELECT apply_link FROM jobs WHERE id = ?", [id])
    if (!rows.length || !rows[0].apply_link) return Response.json({ error: "No apply link" }, { status: 404 })
    let url = String(rows[0].apply_link).trim()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    try {
      await db.execute(
        "CREATE TABLE IF NOT EXISTS job_clicks (id INT AUTO_INCREMENT PRIMARY KEY, job_id INT NOT NULL, clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
      )
      await db.execute("INSERT INTO job_clicks (job_id) VALUES (?)", [id])
    } catch { void 0 }
    const headers = new Headers({ Location: url })
    return new Response(null, { status: 302, headers })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function HEAD(req, context) {
  try {
    const params = (context && typeof context.params?.then === "function") ? await context.params : (context?.params || {})
    const id = Number(params?.id)
    if (!id || Number.isNaN(id)) return new Response(null, { status: 400 })
    const [rows] = await db.query("SELECT apply_link FROM jobs WHERE id = ?", [id])
    if (!rows.length || !rows[0].apply_link) return new Response(null, { status: 404 })
    let url = String(rows[0].apply_link).trim()
    if (!/^https?:\/\//i.test(url)) url = `https://${url}`
    const headers = new Headers({ Location: url })
    return new Response(null, { status: 302, headers })
  } catch {
    return new Response(null, { status: 500 })
  }
}
