"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, Rocket, Users, Award, Code, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function InnovationPage() {
  const [projects, setProjects] = useState<{ id: string; title: string; description: string; status: string; studentName: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "" })

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/projects")
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load projects")
        if (active) setProjects(data)
      } catch (e: any) {
        if (active) setError(e.message || "Unexpected error")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="relative rounded-xl bg-gradient-to-r from-[#0a1628] to-[#1a2f4f] p-8 md:p-12 text-white overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <Lightbulb className="h-full w-full" />
          </div>
          <div className="relative max-w-2xl space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold">Innovation Hub</h1>
            <p className="text-xl text-gray-200 leading-relaxed">
              Transform your ideas into reality. The Innovation Hub provides resources, mentorship, and collaboration
              opportunities for students working on cutting-edge projects.
            </p>
            <Button className="bg-[#be2e38] hover:bg-[#a0252e] h-12 px-8 text-base" onClick={() => setShowForm((s) => !s)}>
              <Rocket className="mr-2 h-5 w-5" />
              {showForm ? "Close" : "Submit Your Project"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Code className="h-6 w-6" />}
            title="Project Showcase"
            description="Display your final year projects, hackathon wins, and personal projects to recruiters and faculty members."
            color="blue"
          />
          <FeatureCard
            icon={<Users className="h-6 w-6" />}
            title="Team Collaboration"
            description="Find team members with complementary skills. Connect with frontend developers, ML engineers, and designers."
            color="green"
          />
          <FeatureCard
            icon={<Award className="h-6 w-6" />}
            title="Competition Hub"
            description="Get updates on hackathons, coding competitions, and innovation challenges with prize pools."
            color="purple"
          />
          <FeatureCard
            icon={<Lightbulb className="h-6 w-6" />}
            title="Mentorship Program"
            description="Connect with faculty mentors and industry experts who can guide your research and development."
            color="orange"
          />
          <FeatureCard
            icon={<Zap className="h-6 w-6" />}
            title="Cloud Credits"
            description="Access free cloud credits from AWS, Azure, and GCP for hosting and deploying your projects."
            color="red"
          />
          <FeatureCard
            icon={<Rocket className="h-6 w-6" />}
            title="Startup Support"
            description="Learn about incubation programs, funding opportunities, and resources for students with startup ideas."
            color="indigo"
          />
        </div>

        {error && <div className="text-center py-4 text-red-600">{error}</div>}
        {loading && <div className="text-center py-8">Loading projects…</div>}

        {showForm && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#be2e38] hover:bg-[#a0252e]"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/projects", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: form.title, description: form.description }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data?.error || "Failed to submit project")
                      setShowForm(false)
                      setForm({ title: "", description: "" })
                      const refreshed = await fetch("/api/projects")
                      const newList = await refreshed.json()
                      setProjects(Array.isArray(newList) ? newList : [])
                    } catch (e: any) {
                      setError(e.message || "Unexpected error")
                    }
                  }}
                >
                  Submit Project
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Student Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p) => (
              <Card key={p.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#0a1628]">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">By {p.studentName || "Student"}</div>
                    <div className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 capitalize">{p.status}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    red: "bg-red-50 text-[#be2e38]",
    indigo: "bg-indigo-50 text-indigo-600",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${colorClasses[color]}`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg text-[#0a1628] mb-2">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
