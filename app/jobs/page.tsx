"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { MapPin, IndianRupee, Calendar, ChevronDown, ChevronUp } from "lucide-react"
interface Job {
  id: string
  company: string
  position: string
  type: "Full-time" | "Internship" | "Part-time"
  location: string
  salary: string
  description: string
  requirements: string[]
  postedDate: string
}
import { Navbar } from "@/components/navbar"
import { getCurrentUser } from "@/lib/auth"

export default function JobsPage() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [showForm, setShowForm] = useState<boolean>(false)
  const [form, setForm] = useState({
    company: "",
    position: "",
    type: "Full-time" as Job["type"],
    location: "",
    salary: "",
    description: "",
    posted_date: "",
    requirementsText: "",
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/jobs")
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load jobs")
        if (active) setJobs(data)
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

  const filteredJobs = filter === "all" ? jobs : jobs.filter((j) => j.type === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">Career Opportunities</h1>
            <p className="text-gray-600 mt-1">Exclusive job and internship listings from top companies</p>
          </div>
          {getCurrentUser()?.role === "admin" && (
            <div className="flex gap-2">
              <Button className="bg-[#be2e38] hover:bg-[#a0252e]" onClick={() => setShowForm((s) => !s)}>
                {showForm ? "Close" : "Add Job"}
              </Button>
            </div>
          )}
        </div>

        {showForm && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as Job["type"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Internship">Internship</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Salary</Label>
                  <Input value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Posted Date</Label>
                  <Input type="date" value={form.posted_date} onChange={(e) => setForm({ ...form, posted_date: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Requirements (one per line)</Label>
                  <Input value={form.requirementsText} onChange={(e) => setForm({ ...form, requirementsText: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#be2e38] hover:bg-[#a0252e]"
                  onClick={async () => {
                    try {
                      const requirements = form.requirementsText
                        .split(/\r?\n/)
                        .map((s) => s.trim())
                        .filter((s) => s.length > 0)
                      const res = await fetch("/api/jobs", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          company: form.company,
                          position: form.position,
                          type: form.type,
                          location: form.location,
                          salary: form.salary,
                          description: form.description,
                          posted_date: form.posted_date,
                          requirements,
                        }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data?.error || "Failed to add job")
                      setShowForm(false)
                      setForm({
                        company: "",
                        position: "",
                        type: "Full-time",
                        location: "",
                        salary: "",
                        description: "",
                        posted_date: "",
                        requirementsText: "",
                      })
                      const refreshed = await fetch("/api/jobs")
                      const newList = await refreshed.json()
                      setJobs(Array.isArray(newList) ? newList : [])
                    } catch (e: any) {
                      setError(e.message || "Unexpected error")
                    }
                  }}
                >
                  Save Job
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-[#be2e38] hover:bg-[#a0252e]" : ""}
          >
            All ({jobs.length})
          </Button>
          <Button
            variant={filter === "Full-time" ? "default" : "outline"}
            onClick={() => setFilter("Full-time")}
            className={filter === "Full-time" ? "bg-[#be2e38] hover:bg-[#a0252e]" : ""}
          >
            Full-time
          </Button>
          <Button
            variant={filter === "Internship" ? "default" : "outline"}
            onClick={() => setFilter("Internship")}
            className={filter === "Internship" ? "bg-[#be2e38] hover:bg-[#a0252e]" : ""}
          >
            Internships
          </Button>
        </div>

        {error && <div className="text-center py-4 text-red-600">{error}</div>}
        {loading && <div className="text-center py-8">Loading jobs…</div>}
        <div className="space-y-4">
          {filteredJobs.map((job) => {
            const isExpanded = expandedJob === job.id

            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-[#0a1628] mb-1">{job.position}</h3>
                          <p className="text-lg text-gray-700 font-medium">{job.company}</p>
                        </div>
                        <Badge className={job.type === "Internship" ? "bg-blue-600" : "bg-[#be2e38]"}>{job.type}</Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-[#be2e38]" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-[#be2e38]" />
                          <span className="font-semibold text-[#0a1628]">{job.salary}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-[#be2e38]" />
                          Posted {job.postedDate}
                        </span>
                      </div>

                      <p className="text-gray-600 leading-relaxed">{job.description}</p>

                      {isExpanded && (
                        <div className="border-t pt-4 mt-4">
                          <h4 className="font-semibold text-[#0a1628] mb-2">Requirements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-gray-600">
                            {job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button className="bg-[#be2e38] hover:bg-[#a0252e] whitespace-nowrap">Apply Now</Button>
                      <Button
                        variant="outline"
                        onClick={() => setExpandedJob(isExpanded ? null : job.id)}
                        className="whitespace-nowrap"
                      >
                        {isExpanded ? (
                          <>
                            <ChevronUp className="mr-2 h-4 w-4" />
                            Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-2 h-4 w-4" />
                            Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No jobs found in this category.</p>
          </div>
        )}
      </main>
    </div>
  )
}
