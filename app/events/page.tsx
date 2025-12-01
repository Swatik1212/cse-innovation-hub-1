"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from "@/components/ui/pagination"
import { Calendar, MapPin, Clock, Tag } from "lucide-react"
import { Navbar } from "@/components/navbar"

interface EventItem {
  id: number
  title: string
  description: string
  event_date: string
  event_time: string
  location: string
  event_type: "Workshop" | "Seminar" | "Hackathon" | "Conference"
  status: "Upcoming" | "Ongoing" | "Completed"
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [tab, setTab] = useState<string>("all")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [page, setPage] = useState<number>(1)
  const [total, setTotal] = useState<number>(0)
  const limit = 10
  const [showForm, setShowForm] = useState<boolean>(false)
  const [search, setSearch] = useState<string>("")
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    event_time: "",
    location: "",
    event_type: "Workshop" as EventItem["event_type"],
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const q1 = tab === "all" ? [] : ["event_type=" + encodeURIComponent(tab)]
        const q2 = ["page=" + page, "limit=" + limit]
        const q3 = search.trim() ? ["q=" + encodeURIComponent(search.trim())] : []
        const qs = (q1.concat(q2).concat(q3).length ? "?" + q1.concat(q2).concat(q3).join("&") : "")
        const res = await fetch(`/api/events${qs}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load events")
        const totalHeader = res.headers.get("X-Total-Count")
        if (active) {
          setEvents(data)
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
  }, [tab, page, search])

  const filtered = events

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">Academic Events</h1>
            <p className="text-gray-600 mt-1">Workshops, seminars, hackathons, and conferences</p>
          </div>
          <div className="flex gap-2">
            <Button className="bg-[#be2e38] hover:bg-[#a0252e]" onClick={() => setShowForm((s) => !s)}>
              {showForm ? "Close" : "Add Event"}
            </Button>
          </div>
        </div>

        {error && <div className="text-center py-4 text-red-600">{error}</div>}
        {loading && <div className="text-center py-8">Loading events…</div>}

        {showForm && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={form.event_type} onValueChange={(v) => setForm({ ...form, event_type: v as EventItem["event_type"] })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Seminar">Seminar</SelectItem>
                      <SelectItem value="Hackathon">Hackathon</SelectItem>
                      <SelectItem value="Conference">Conference</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#be2e38] hover:bg-[#a0252e]"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/events", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: form.title,
                          description: form.description,
                          event_date: form.event_date,
                          event_time: form.event_time,
                          location: form.location,
                          event_type: form.event_type,
                          status: "Upcoming",
                        }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data?.error || "Failed to add event")
                      setShowForm(false)
                      setForm({ title: "", description: "", event_date: "", event_time: "", location: "", event_type: "Workshop" })
                      const refreshed = await fetch("/api/events")
                      const newList = await refreshed.json()
                      setEvents(Array.isArray(newList) ? newList : [])
                    } catch (e: any) {
                      setError(e.message || "Unexpected error")
                    }
                  }}
                >
                  Save Event
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="w-full md:w-1/2">
            <Input placeholder="Search events (title, description, location)" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
          </div>
        </div>
        <Tabs
          value={tab}
          onValueChange={(v) => {
            setTab(v)
            setPage(1)
          }}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="Workshop">Workshops</TabsTrigger>
            <TabsTrigger value="Seminar">Seminars</TabsTrigger>
            <TabsTrigger value="Hackathon">Hackathons</TabsTrigger>
            <TabsTrigger value="Conference">Conferences</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-2 space-y-4">
            {filtered.map((e) => (
              <Card key={e.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-[#0a1628] mb-1">{e.title}</h3>
                          <p className="text-gray-700">{e.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-[#be2e38]" />
                          <span className="text-sm font-semibold">{e.event_type}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-[#be2e38]" />
                          {new Date(e.event_date).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                        {e.event_time && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-[#be2e38]" />
                            {e.event_time}
                          </span>
                        )}
                        {e.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-[#be2e38]" />
                            {e.location}
                          </span>
                        )}
                      </div>

                      {expandedId === e.id && (
                        <div className="border-t pt-4 mt-4 space-y-2">
                          <div className="text-sm text-gray-600">Status: <span className="font-medium">{e.status}</span></div>
                        </div>
                      )}
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <Button
                        className="bg-[#be2e38] hover:bg-[#a0252e] whitespace-nowrap"
                        onClick={() => setExpandedId(expandedId === e.id ? null : e.id)}
                      >
                        Details
                      </Button>
                      <a href={toGoogleCalendarLink(e)} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="whitespace-nowrap">Add to Calendar</Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
        {filtered.length === 0 && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found in this category.</p>
          </div>
        )}
        <div className="flex justify-end">
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
      </main>
    </div>
  )
}
  function toGoogleCalendarLink(e: EventItem) {
    try {
      const datePart = e.event_date
      const timePart = e.event_time || "09:00"
      const start = new Date(`${datePart}T${timePart}:00`)
      const end = new Date(start.getTime() + 60 * 60 * 1000)
      const pad = (n: number) => String(n).padStart(2, "0")
      const fmt = (d: Date) =>
        `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`
      const dates = `${fmt(start)}/${fmt(end)}`
      const params = new URLSearchParams({
        action: "TEMPLATE",
        text: e.title,
        dates,
        details: e.description || "",
        location: e.location || "",
      })
      return `https://www.google.com/calendar/render?${params.toString()}`
    } catch {
      return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(e.title)}`
    }
  }
