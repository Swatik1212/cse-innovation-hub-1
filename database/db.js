import mysql from "mysql2/promise"

function fromDatabaseUrl(url) {
  try {
    const u = new URL(url)
    const host = u.hostname
    const port = Number(u.port || 3306)
    const user = decodeURIComponent(u.username)
    const password = decodeURIComponent(u.password)
    const database = u.pathname.replace(/^\//, "")
    return { host, port, user, password, database }
  } catch {
    return null
  }
}

const cfgFromUrl = process.env.DATABASE_URL ? fromDatabaseUrl(process.env.DATABASE_URL) : null
const host =
  (cfgFromUrl?.host ??
    process.env.DB_HOST ??
    process.env.MYSQLHOST ??
    process.env.MYSQL_HOST ??
    process.env.MYSQLHOSTNAME ??
    process.env.JAWSDB_HOST) ??
  "127.0.0.1"
const port =
  (cfgFromUrl?.port ??
    (process.env.DB_PORT ?? process.env.MYSQLPORT ?? process.env.MYSQL_PORT ?? process.env.JAWSDB_PORT)) ??
  3306
const user =
  (cfgFromUrl?.user ??
    process.env.DB_USER ??
    process.env.MYSQLUSER ??
    process.env.MYSQL_USER ??
    process.env.JAWSDB_USERNAME) ??
  "root"
const password =
  (cfgFromUrl?.password ??
    process.env.DB_PASS ??
    process.env.MYSQLPASSWORD ??
    process.env.MYSQL_PASSWORD ??
    process.env.JAWSDB_PASSWORD) ??
  "root123"
const database =
  (cfgFromUrl?.database ??
    process.env.DB_NAME ??
    process.env.MYSQLDATABASE ??
    process.env.MYSQL_DATABASE ??
    process.env.JAWSDB_DATABASE) ??
  "cse_hub"

const sslEnabled = Boolean(
  (process.env.DB_SSL && process.env.DB_SSL !== "false") ||
    (process.env.MYSQL_SSL && process.env.MYSQL_SSL !== "false") ||
    (process.env.DATABASE_URL && /[?&]ssl=(true|1)/i.test(process.env.DATABASE_URL)) ||
    (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith("mysqls://"))
)
const ssl = sslEnabled ? { rejectUnauthorized: true } : undefined

export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  ssl,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

