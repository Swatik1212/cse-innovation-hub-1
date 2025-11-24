"use client"

import { useEffect, useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function SettingsPage() {
  const [me, setMe] = useState<{ email: string; role: string } | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ current: "", next: "", confirm: "" })

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setMe({ email: data.email, role: data.role })
        }
      } catch {}
    })()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-xl mx-auto bg-white">
          <CardHeader>
            <CardTitle className="text-2xl">Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 text-green-900 border-green-200">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1 text-sm text-gray-600">
              <div>Email: {me?.email || "Not signed in"}</div>
              <div>Role: {me?.role || "-"}</div>
            </div>

            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <Input type="password" value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-[#be2e38] hover:bg-[#a0252e]"
                disabled={loading}
                onClick={async () => {
                  try {
                    setError("")
                    setSuccess("")
                    setLoading(true)
                    if (!form.current || !form.next || !form.confirm) {
                      setError("Fill all fields")
                      setLoading(false)
                      return
                    }
                    if (form.next !== form.confirm) {
                      setError("Passwords do not match")
                      setLoading(false)
                      return
                    }
                    const res = await fetch("/api/auth/change-password", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ current_password: form.current, new_password: form.next }),
                    })
                    const data = await res.json()
                    if (!res.ok) {
                      setError(data?.error || "Failed to change password")
                    } else {
                      setSuccess("Password updated")
                      setForm({ current: "", next: "", confirm: "" })
                    }
                  } catch (e: any) {
                    setError(e.message || "Unexpected error")
                  } finally {
                    setLoading(false)
                  }
                }}
              >
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

