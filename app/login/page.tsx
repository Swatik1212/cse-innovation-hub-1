"use client"

import type React from "react"
import { Suspense } from "react"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GraduationCap, AlertCircle } from "lucide-react"
import { login } from "@/lib/auth"

function LoginContent() {
  const router = useRouter()
  const params = useSearchParams()
  const isAdmin = params.get("admin") === "1"
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Simple validation
    if (!email || !password) {
      setError("Please fill in all fields")
      setLoading(false)
      return
    }

    // Attempt login
    const user = await login(email, password)
    if (user) {
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded bg-[#be2e38]">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-[#0a1628]">{isAdmin ? "Admin Login" : "Welcome Back"}</CardTitle>
          <CardDescription>
            {isAdmin ? "Sign in with admin credentials" : "Sign in to access your CSE Innovation Hub account"}
          </CardDescription>
          <div className="mt-2">
            {isAdmin ? (
              <Link href="/login" className="text-sm font-medium text-[#be2e38] hover:underline">Switch to Student Login</Link>
            ) : (
              <Link href="/login?admin=1" className="text-sm font-medium text-[#be2e38] hover:underline">Switch to Admin Login</Link>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@college.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full bg-[#be2e38] hover:bg-[#a0252e]" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/register" className="text-[#be2e38] hover:underline font-semibold">
                Register here
              </Link>
            </div>

            <div className="text-center">
              <Link href="/" className="text-sm text-gray-600 hover:text-[#be2e38]">
                ← Back to Home
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
