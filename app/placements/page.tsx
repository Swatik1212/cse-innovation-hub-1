"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ExternalLink, FileText, BookOpen, Building2, BarChart3 } from "lucide-react"
import { placementResources } from "@/lib/data"
import { Navbar } from "@/components/navbar"

export default function PlacementsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">Placement Cell</h1>
          <p className="text-gray-600 mt-1">Resources, guidelines, and statistics for your placement journey</p>
        </div>

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

          <TabsContent value="all" className="mt-6 space-y-4">
            {placementResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="Guide" className="mt-6 space-y-4">
            {placementResources
              .filter((r) => r.category === "Guide")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </TabsContent>

          <TabsContent value="Company" className="mt-6 space-y-4">
            {placementResources
              .filter((r) => r.category === "Company")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </TabsContent>

          <TabsContent value="Statistics" className="mt-6 space-y-4">
            {placementResources
              .filter((r) => r.category === "Statistics")
              .map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function ResourceCard({ resource }: { resource: any }) {
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
