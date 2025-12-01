import { db } from "@/database/db"

export async function GET() {
  const cfgFromUrl = process.env.DATABASE_URL ? safeParseUrl(process.env.DATABASE_URL) : null
  const host =
    (cfgFromUrl && cfgFromUrl.host) ||
    process.env.DB_HOST ||
    process.env.MYSQLHOST ||
    process.env.MYSQL_HOST ||
    process.env.MYSQLHOSTNAME ||
    process.env.JAWSDB_HOST ||
    "127.0.0.1"
  const port =
    (cfgFromUrl && cfgFromUrl.port) ||
    Number(
      process.env.DB_PORT || process.env.MYSQLPORT || process.env.MYSQL_PORT || process.env.JAWSDB_PORT || 3306
    )
  const sslEnabled = Boolean(
    (process.env.DB_SSL && process.env.DB_SSL !== "false") ||
      (process.env.MYSQL_SSL && process.env.MYSQL_SSL !== "false") ||
      (process.env.DATABASE_URL && /[?&]ssl=(true|1)/i.test(process.env.DATABASE_URL)) ||
      (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysqls://"))
  )
  try {
    const [rows] = await db.query("SELECT 1 AS ok")
    return Response.json({ ok: true, result: rows?.[0]?.ok === 1, cfg: { host, port, sslEnabled } })
  } catch (error) {
    return Response.json(
      { ok: false, error: String(error?.message || error), cfg: { host, port, sslEnabled } },
      { status: 500 }
    )
  }
}

function safeParseUrl(url) {
  try {
    const u = new URL(url)
    return { host: u.hostname, port: Number(u.port || 3306) }
  } catch {
    return null
  }
}
