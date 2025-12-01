import { db } from "@/database/db"
import { verifySession } from "@/lib/session"
export const runtime = "nodejs"

export async function PATCH(req, context) {
  try {
    const params = (context && typeof context.params?.then === "function") ? await context.params : (context?.params || {})
    const id = Number(params?.id)
    if (!id || Number.isNaN(id)) return Response.json({ error: "Invalid job id" }, { status: 400 })

    const cookie = req.headers.get("cookie") || ""
    const sessionPair = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
    const token = sessionPair ? sessionPair.substring("session=".length) : ""
    const payload = verifySession(token)
    if (!payload || payload.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()
    const fields = {
      company: body.company,
      position: body.position,
      type: body.type,
      location: body.location,
      salary: body.salary,
      description: body.description,
      posted_date: body.posted_date,
      apply_link: body.apply_link,
    }

    if (fields.apply_link !== undefined) {
      const v = (fields.apply_link || "").trim()
      if (v === "") {
        fields.apply_link = null
      } else {
        if (!/^https?:\/\//i.test(v)) {
          return Response.json({ error: "apply_link must start with http:// or https://" }, { status: 400 })
        }
        try {
          const u = new URL(v)
          if (!/^https?:$/i.test(u.protocol)) {
            return Response.json({ error: "apply_link must use http/https" }, { status: 400 })
          }
          const blocked = new Set(["example.com", "company.com", "www.example.com", "www.company.com"])
          if (blocked.has(u.hostname) || /\.example$/i.test(u.hostname) || /^example$/i.test(u.hostname)) {
            return Response.json({ error: "apply_link host is not allowed" }, { status: 400 })
          }
          if (v.length > 2048) {
            return Response.json({ error: "apply_link too long" }, { status: 400 })
          }
          fields.apply_link = v
        } catch {
          return Response.json({ error: "apply_link is not a valid URL" }, { status: 400 })
        }
      }
    }
    const updates = []
    const paramsArr = []
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined) {
        updates.push(`${k} = ?`)
        paramsArr.push(v === "" ? null : v)
      }
    }
    if (!updates.length) return Response.json({ error: "No fields to update" }, { status: 400 })

    await db.execute(`UPDATE jobs SET ${updates.join(", ")} WHERE id = ?`, [...paramsArr, id])
    return Response.json({ id }, { status: 200 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
