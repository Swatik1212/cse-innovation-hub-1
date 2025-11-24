import { verifySession } from "@/lib/session"

export async function GET(req) {
  const cookie = req.headers.get("cookie") || ""
  const match = cookie.split(";").map((p) => p.trim()).find((p) => p.startsWith("session="))
  const token = match ? match.substring("session=".length) : ""
  const payload = verifySession(token)
  if (!payload) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  return Response.json({ id: payload.uid, email: payload.email, role: payload.role })
}

