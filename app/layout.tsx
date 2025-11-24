import type React from "react"
import type { Metadata } from "next"
import Link from "next/link"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CSE Innovation Hub - Department Portal",
  description: "Central platform for CSE students to access events, jobs, placements, and innovation resources",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <footer className="mt-12 border-t border-gray-200">
          <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-sm text-gray-600">© {new Date().getFullYear()} CSE Innovation Hub</span>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm text-gray-700 hover:text-[#be2e38]">Student Login</Link>
              <Link href="/login?admin=1" className="text-sm text-gray-700 hover:text-[#be2e38]">Admin Login</Link>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
