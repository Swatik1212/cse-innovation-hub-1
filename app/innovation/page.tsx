"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lightbulb, Rocket, Users, Award, Code, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

export default function InnovationPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<{ id: string; title: string; description: string; status: string; studentName: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: "", description: "" })
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const limit = 10
  const [editStatus, setEditStatus] = useState<Record<string, string>>({})
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("latest")

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const parts = [
          `page=${page}`,
          `limit=${limit}`,
          statusFilter !== "all" ? `status=${encodeURIComponent(statusFilter)}` : "",
          searchQuery.trim() ? `q=${encodeURIComponent(searchQuery.trim())}` : "",
          sortBy ? `sort=${encodeURIComponent(sortBy)}` : "",
        ].filter(Boolean)
        const res = await fetch(`/api/projects?${parts.join("&")}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load projects")
        const totalHeader = res.headers.get("X-Total-Count")
        if (active) {
          setProjects(data)
          setTotal(totalHeader ? Number(totalHeader) : data.length)
        }
      } catch (e: any) {
        if (active) setError(e.message || "Unexpected error")
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => {
      active = false
    }
  }, [page, statusFilter, searchQuery, sortBy])

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
            <Button className="bg-[#be2e38] hover:bg-[#a0252e] h-12 px-8 text-base" onClick={() => {
              const user = getCurrentUser()
              if (!user) {
                setError("Please log in to submit a project")
                router.push("/login")
                return
              }
              setShowForm((s) => !s)
            }}>
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
                      if (res.status === 401) {
                        setError("Unauthorized: please log in to submit a project")
                        router.push("/login")
                        return
                      }
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#0a1628]">Student Projects</h2>
            <div className="flex items-center gap-2">
              <Input
                placeholder="Search projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="proposed">Proposed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                <SelectTrigger className="h-9 w-40">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {projects
              .filter((p) => {
                const q = searchQuery.trim().toLowerCase()
                if (!q) return true
                return (
                  p.title.toLowerCase().includes(q) ||
                  p.description.toLowerCase().includes(q) ||
                  (p.studentName || "").toLowerCase().includes(q)
                )
              })
              .sort((a, b) => {
                if (sortBy === "title") return a.title.localeCompare(b.title)
                if (sortBy === "status") return (b.status || "").localeCompare(a.status || "")
                return Number(b.id) - Number(a.id)
              })
              .map((p) => (
              <Card key={p.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-[#0a1628]">{p.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{p.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">By {p.studentName || "Student"}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 capitalize">{editStatus[p.id] || p.status}</span>
                      {getCurrentUser()?.role === "admin" && (
                        <div className="flex items-center gap-2">
                          <Select value={editStatus[p.id] || p.status} onValueChange={(v) => setEditStatus((s) => ({ ...s, [p.id]: v }))}>
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="proposed">proposed</SelectItem>
                              <SelectItem value="approved">approved</SelectItem>
                              <SelectItem value="rejected">rejected</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            className="h-8"
                            onClick={async () => {
                              try {
                                const newStatus = editStatus[p.id] || p.status
                                const res = await fetch("/api/projects", {
                                  method: "PATCH",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ id: p.id, status: newStatus }),
                                })
                                const data = await res.json()
                                if (!res.ok) throw new Error(data?.error || "Failed to update status")
                                setProjects((list) => list.map((it) => (it.id === p.id ? { ...it, status: newStatus } : it)))
                              } catch (e: any) {
                                setError(e.message || "Unexpected error")
                              }
                            }}
                          >
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex justify-end mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 py-2 text-sm">Page {page} of {Math.max(1, Math.ceil(total / limit))}</span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage((p) => (p < Math.ceil(total / limit) ? p + 1 : p))}
                    aria-disabled={page >= Math.ceil(total / limit)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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
