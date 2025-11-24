"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Download, ExternalLink, FileText, BookOpen, Building2, BarChart3 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { getCurrentUser } from "@/lib/auth"

interface PlacementResource {
  id: string
  title: string
  category: "Guide" | "Resource" | "Company" | "Statistics"
  description: string
  link?: string
  downloadUrl?: string
}

export default function PlacementsPage() {
  const [resources, setResources] = useState<PlacementResource[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [showForm, setShowForm] = useState<boolean>(false)
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Guide" as PlacementResource["category"],
    link: "",
    download_url: "",
  })

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/placements")
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load placement resources")
        if (active) setResources(data)
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

  const guide = useMemo(() => resources.filter((r) => r.category === "Guide"), [resources])
  const company = useMemo(() => resources.filter((r) => r.category === "Company"), [resources])
  const stats = useMemo(() => resources.filter((r) => r.category === "Statistics"), [resources])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">Placement Cell</h1>
            <p className="text-gray-600 mt-1">Resources, guidelines, and statistics for your placement journey</p>
          </div>
          {getCurrentUser()?.role === "admin" && (
            <div className="flex gap-2">
              <Button className="bg-[#be2e38] hover:bg-[#a0252e]" onClick={() => setShowForm((s) => !s)}>
                {showForm ? "Close" : "Add Resource"}
              </Button>
            </div>
          )}
        </div>

        {showForm && (
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as PlacementResource["category"] })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>Description</Label>
                  <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Link</Label>
                  <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Download URL</Label>
                  <Input value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  className="bg-[#be2e38] hover:bg-[#a0252e]"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/placements", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          title: form.title,
                          description: form.description,
                          category: form.category,
                          link: form.link || null,
                          download_url: form.download_url || null,
                        }),
                      })
                      const data = await res.json()
                      if (!res.ok) throw new Error(data?.error || "Failed to add resource")
                      setShowForm(false)
                      setForm({ title: "", description: "", category: "Guide", link: "", download_url: "" })
                      const refreshed = await fetch("/api/placements")
                      const newList = await refreshed.json()
                      setResources(Array.isArray(newList) ? newList : [])
                    } catch (e: any) {
                      setError(e.message || "Unexpected error")
                    }
                  }}
                >
                  Save Resource
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        <div className="grid gap-4 md:grid-cols-4 bg-[#0a1628] text-white p-6 rounded-lg">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#be2e38]">₹44 LPA</p>
            <p className="text-sm text-gray-300 mt-1">Highest Package 2024</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#be2e38]">₹8.2 LPA</p>
            <p className="text-sm text-gray-300 mt-1">Average Package</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#be2e38]">85+</p>
            <p className="text-sm text-gray-300 mt-1">Companies Visited</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#be2e38]">95%</p>
            <p className="text-sm text-gray-300 mt-1">Placement Rate</p>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-4">
            <TabsTrigger value="all">All Resources</TabsTrigger>
            <TabsTrigger value="Guide">Guides</TabsTrigger>
            <TabsTrigger value="Company">Companies</TabsTrigger>
            <TabsTrigger value="Statistics">Statistics</TabsTrigger>
          </TabsList>

          {error && <div className="text-center py-4 text-red-600">{error}</div>}
          {loading && <div className="text-center py-8">Loading resources…</div>}

          <TabsContent value="all" className="mt-6 space-y-4">
            {resources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="Guide" className="mt-6 space-y-4">
            {guide.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="Company" className="mt-6 space-y-4">
            {company.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="Statistics" className="mt-6 space-y-4">
            {stats.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ResourceCard({ resource }: { resource: PlacementResource }) {
  const iconMap = {
    Guide: <FileText className="h-6 w-6" />,
    Resource: <BookOpen className="h-6 w-6" />,
    Company: <Building2 className="h-6 w-6" />,
    Statistics: <BarChart3 className="h-6 w-6" />,
  }

  const colorMap = {
    Guide: "bg-blue-50 text-blue-600",
    Resource: "bg-green-50 text-green-600",
    Company: "bg-purple-50 text-purple-600",
    Statistics: "bg-orange-50 text-orange-600",
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6 flex gap-4">
        <div
          className={`h-14 w-14 rounded-lg flex items-center justify-center shrink-0 ${colorMap[resource.category]}`}
        >
          {iconMap[resource.category]}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold text-lg text-[#0a1628]">{resource.title}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 border inline-block mt-1">
                {resource.category}
              </span>
            </div>
            <div className="flex gap-2">
              {resource.downloadUrl && (
                <Button size="sm" className="bg-[#be2e38] hover:bg-[#a0252e]">
                  <Download className="mr-1 h-4 w-4" />
                  Download
                </Button>
              )}
              {resource.link && (
                <Button size="sm" variant="outline">
                  <ExternalLink className="mr-1 h-4 w-4" />
                  View
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed">{resource.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
