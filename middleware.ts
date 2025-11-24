import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("admin", "1")
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith("/dashboard")) {
    const cookie = req.headers.get("cookie") || ""
    const hasSession = cookie.split(";").map((p: string) => p.trim()).some((p: string) => p.startsWith("session="))
    if (!hasSession) {
      const url = req.nextUrl.clone()
      url.pathname = "/login"
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/admin"],
}
