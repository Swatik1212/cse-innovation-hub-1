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
const host = (cfgFromUrl && cfgFromUrl.host) || process.env.DB_HOST || "127.0.0.1"
const port = (cfgFromUrl && cfgFromUrl.port) || Number(process.env.DB_PORT || 3306)
const user = (cfgFromUrl && cfgFromUrl.user) || process.env.DB_USER || "root"
const password = (cfgFromUrl && cfgFromUrl.password) || process.env.DB_PASS || "root123"
const database = (cfgFromUrl && cfgFromUrl.database) || process.env.DB_NAME || "cse_hub"

export const db = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

