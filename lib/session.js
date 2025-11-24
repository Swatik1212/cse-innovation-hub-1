import crypto from "crypto"

const secret = process.env.AUTH_SECRET || "change-this-secret"

function b64urlEncode(str) {
  return Buffer.from(str).toString("base64url")
}

function b64urlDecode(str) {
  return Buffer.from(str, "base64url").toString()
}

export function signSession(payload) {
  const data = JSON.stringify(payload)
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url")
  return `${b64urlEncode(data)}.${sig}`
}

export function verifySession(token) {
  if (!token || typeof token !== "string") return null
  const parts = token.split(".")
  if (parts.length !== 2) return null
  const [payloadB64, sig] = parts
  const data = b64urlDecode(payloadB64)
  const expectedSig = crypto.createHmac("sha256", secret).update(data).digest("base64url")
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null
  let payload
  try {
    payload = JSON.parse(data)
  } catch {
    return null
  }
  if (payload.exp && Date.now() > payload.exp) return null
  return payload
}

export function cookieHeaderForSession(payload) {
  const token = signSession(payload)
  const maxAge = 60 * 60 * 24 * 7
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : ""
  return `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
}

