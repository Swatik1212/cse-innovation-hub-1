import { db } from "@/database/db"
export const runtime = "nodejs"

export async function GET(req) {
  try {
    const url = new URL(req.url)
    const jobIdParam = url.searchParams.get("job_id")
    const page = Math.max(1, Number(url.searchParams.get("page") || 1))
    const limit = Math.max(1, Math.min(100, Number(url.searchParams.get("limit") || 50)))
    const offset = (page - 1) * limit

    const where = []
    const params = []
    if (jobIdParam) {
      where.push("job_id = ?")
      params.push(Number(jobIdParam))
    }
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : ""

    let rows = []
    try {
      await db.execute(
        "CREATE TABLE IF NOT EXISTS job_clicks (id INT AUTO_INCREMENT PRIMARY KEY, job_id INT NOT NULL, clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)"
      )
      const [r] = await db.query(
        `SELECT job_id, COUNT(*) AS clicks FROM job_clicks ${whereSql} GROUP BY job_id ORDER BY clicks DESC LIMIT ? OFFSET ?`,
        [...params, limit, offset]
      )
      rows = r
    } catch {
      rows = []
    }
    let total = 0
    try {
      const [countRows] = await db.query(
        `SELECT COUNT(DISTINCT job_id) AS total FROM job_clicks ${whereSql}`,
        params
      )
      total = Number((countRows && countRows[0] && countRows[0].total) || 0)
    } catch {
      total = rows.length
    }
    return Response.json(rows, { headers: { "X-Total-Count": String(total) } })
  } catch {
    return Response.json([], { status: 200 })
  }
}
