import fs from 'fs'
import path from 'path'
import mysql from 'mysql2/promise'

function fromDatabaseUrl(url) {
  try {
    const u = new URL(url)
    return {
      host: u.hostname,
      port: Number(u.port || 3306),
      user: decodeURIComponent(u.username),
      password: decodeURIComponent(u.password),
      database: u.pathname.replace(/^\//, ''),
    }
  } catch {
    return null
  }
}

async function main() {
  const cfgFromUrl = process.env.DATABASE_URL ? fromDatabaseUrl(process.env.DATABASE_URL) : null
  const host = cfgFromUrl?.host ?? process.env.DB_HOST ?? process.env.MYSQLHOST ?? process.env.MYSQL_HOST ?? '127.0.0.1'
  const port = cfgFromUrl?.port ?? Number(process.env.DB_PORT ?? process.env.MYSQLPORT ?? process.env.MYSQL_PORT ?? 3306)
  const user = cfgFromUrl?.user ?? process.env.DB_USER ?? process.env.MYSQLUSER ?? process.env.MYSQL_USER ?? 'root'
  const password = cfgFromUrl?.password ?? process.env.DB_PASS ?? process.env.MYSQLPASSWORD ?? process.env.MYSQL_PASSWORD ?? 'root123'
  const database = cfgFromUrl?.database ?? process.env.DB_NAME ?? process.env.MYSQLDATABASE ?? process.env.MYSQL_DATABASE ?? 'cse_hub'

  const schemaPath = path.resolve('database', 'schema.sql')
  const sql = fs.readFileSync(schemaPath, 'utf8')

  let conn
  try {
    // Try without database first (works for local MySQL).
    conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true })
    try {
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``)
    } catch (e) {
      // Some cloud providers (e.g., PlanetScale) disallow CREATE DATABASE; continue.
      console.warn('CREATE DATABASE skipped:', e?.message || e)
    }
    await conn.end()

    // Connect with database selected and apply schema.
    conn = await mysql.createConnection({ host, port, user, password, database, multipleStatements: true })
    await conn.query(sql)
    const [evc] = await conn.query('SELECT COUNT(*) AS c FROM events')
    if ((evc[0] && evc[0].c === 0) || (!evc[0] && evc.c === 0)) {
      await conn.query(
        'INSERT INTO events (title, description, event_date, event_time, location, event_type, status, organizer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        ['Career Fair', 'Meet recruiters', '2025-12-05', '10:00', 'Auditorium', 'Workshop', 'Upcoming', 'CSE Dept']
      )
    }
    const [jc] = await conn.query('SELECT COUNT(*) AS c FROM jobs')
    if ((jc[0] && jc[0].c === 0) || (!jc[0] && jc.c === 0)) {
      const [res] = await conn.query(
        'INSERT INTO jobs (title, company, position, type, location, salary, description, posted_date, apply_link) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        ['SWE Intern', 'TechCorp', 'SWE Intern', 'Internship', 'Remote', '₹50,000', 'Build features', '2025-11-20', 'https://example.com/apply']
      )
      const id = res.insertId
      await conn.query('INSERT INTO job_requirements (job_id, requirement) VALUES (?, ?), (?, ?), (?, ?)', [
        id,
        'JavaScript',
        id,
        'React',
        id,
        'SQL',
      ])
    }
    const [pc] = await conn.query('SELECT COUNT(*) AS c FROM placements')
    if ((pc[0] && pc[0].c === 0) || (!pc[0] && pc.c === 0)) {
      await conn.query(
        'INSERT INTO placements (title, description, category, link, download_url) VALUES (?, ?, ?, ?, ?)',
        ['Interview Guide', 'Tips and tricks', 'Guide', 'https://example.com/guide', null]
      )
    }
    const [prc] = await conn.query('SELECT COUNT(*) AS c FROM projects')
    if ((prc[0] && prc[0].c === 0) || (!prc[0] && prc.c === 0)) {
      await conn.query(
        "INSERT INTO projects (title, student_id, description, status) VALUES ('ML Research', NULL, 'Investigate models', 'proposed')"
      )
    }
    console.log('Database bootstrapped:', { host, port, user, database })
  } finally {
    if (conn) await conn.end()
  }
}

main().catch((err) => {
  console.error('Bootstrap failed:', err?.message || err)
  process.exit(1)
})
