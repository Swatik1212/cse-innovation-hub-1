"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Briefcase, Award, Lightbulb, LogOut } from "lucide-react"
import { getCurrentUser, logout } from "@/lib/auth"
import { Navbar } from "@/components/navbar"
import type { User as AuthUser } from "@/lib/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [events, setEvents] = useState<any[]>([])
  const [jobs, setJobs] = useState<any[]>([])
  const [placements, setPlacements] = useState<any[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/login")
    } else {
      setUser(currentUser)
    }
  }, [router])

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const [eRes, jRes, pRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/jobs"),
          fetch("/api/placements"),
        ])
        const [eData, jData, pData] = await Promise.all([
          eRes.json(),
          jRes.json(),
          pRes.json(),
        ])
        if (active) {
          setEvents(Array.isArray(eData) ? eData : [])
          setJobs(Array.isArray(jData) ? jData : [])
          setPlacements(Array.isArray(pData) ? pData : [])
        }
      } catch {}
    })()
    return () => {
      active = false
    }
  }, [])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="bg-[#0a1628] text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-[#be2e38] flex items-center justify-center">
              <LogOut className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome back, {user.name}!</h1>
              <p className="text-gray-300">
                {user.department} - Year {user.year} | Roll: {user.rollNumber}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="bg-transparent border-white text-white hover:bg-white hover:text-[#0a1628]"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Upcoming Events"
            count={events.length}
            icon={<Calendar className="h-6 w-6" />}
            href="/events"
            color="blue"
          />
          <StatsCard
            title="Active Jobs"
            count={jobs.length}
            icon={<Briefcase className="h-6 w-6" />}
            href="/jobs"
            color="green"
          />
          <StatsCard
            title="Placement Resources"
            count={placements.length}
            icon={<Award className="h-6 w-6" />}
            href="/placements"
            color="red"
          />
          <StatsCard
            title="Innovation Projects"
            count={12}
            icon={<Lightbulb className="h-6 w-6" />}
            href="/innovation"
            color="purple"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Upcoming Events</CardTitle>
              <Link href="/events" className="text-sm text-[#be2e38] hover:underline font-semibold">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {events.slice(0, 3).map((event: any) => (
                <div
                  key={event.id}
                  className="flex gap-4 p-4 rounded-lg border hover:border-[#be2e38] transition-colors"
                >
                  <div className="flex flex-col items-center justify-center bg-[#be2e38] text-white rounded-lg p-3 min-w-[70px]">
                    <span className="text-xs font-bold uppercase">
                      {new Date(event.event_date || event.date).toLocaleDateString("en", { month: "short" })}
                    </span>
                    <span className="text-2xl font-bold">{new Date(event.event_date || event.date).getDate()}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0a1628] mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
                    <p className="text-xs text-gray-500">{event.location}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Latest Opportunities</CardTitle>
              <Link href="/jobs" className="text-sm text-[#be2e38] hover:underline font-semibold">
                View all →
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {jobs.slice(0, 3).map((job: any) => (
                <div
                  key={job.id}
                  className="flex items-start justify-between p-4 rounded-lg border hover:border-[#be2e38] transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#0a1628] mb-1">{job.position}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.company}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                        {job.type}
                      </span>
                      <span className="text-xs text-gray-500">{job.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#be2e38]">{job.salary}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

function StatsCard({
  title,
  count,
  icon,
  href,
  color,
}: {
  title: string
  count: number
  icon: React.ReactNode
  href: string
  color: "blue" | "green" | "red" | "purple"
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    red: "bg-red-50 text-[#be2e38]",
    purple: "bg-purple-50 text-purple-600",
  }

  return (
    <Link href={href}>
      <Card className="transition-all hover:shadow-lg hover:border-[#be2e38]">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-3xl font-bold text-[#0a1628]">{count}</p>
            </div>
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
