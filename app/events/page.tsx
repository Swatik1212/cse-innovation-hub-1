"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock } from "lucide-react"
import { events } from "@/lib/data"
import { Navbar } from "@/components/navbar"

export default function EventsPage() {
  const [filter, setFilter] = useState<string>("all")

  const filteredEvents = filter === "all" ? events : events.filter((e) => e.type === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#0a1628]">Academic Events</h1>
            <p className="text-gray-600 mt-1">Workshops, seminars, hackathons, and conferences</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-[#be2e38] hover:bg-[#a0252e]" : ""}
            >
              All Events
            </Button>
            <Button
              variant={filter === "Workshop" ? "default" : "outline"}
              onClick={() => setFilter("Workshop")}
              className={filter === "Workshop" ? "bg-[#be2e38] hover:bg-[#a0252e]" : ""}
            >
              Workshops
            </Button>
            <Button
              variant={filter === "Hackathon" ? "default" : "outline"}
              onClick={() => setFilter("Hackathon")}
              className={filter === "Hackathon" ? "bg-[#be2e38] hover:bg-[#a0252e]" : ""}
            >
              Hackathons
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge className="bg-[#be2e38]">{event.type}</Badge>
                  <Badge
                    variant="outline"
                    className={event.status === "Upcoming" ? "border-green-500 text-green-700" : "border-gray-400"}
                  >
                    {event.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl text-[#0a1628]">{event.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <p className="text-gray-600 text-sm leading-relaxed">{event.description}</p>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-[#be2e38]" />
                    <span>
                      {new Date(event.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4 text-[#be2e38]" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 text-[#be2e38]" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-[#0a1628] hover:bg-[#0a1628]/90">Register Now</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No events found in this category.</p>
          </div>
        )}
      </main>
    </div>
  )
}
