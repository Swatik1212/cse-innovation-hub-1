"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, IndianRupee, Calendar, ChevronDown, ChevronUp } from "lucide-react"
import { jobs } from "@/lib/data"
import { Navbar } from "@/components/navbar"

export default function JobsPage() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>("all")

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
        </div>

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
