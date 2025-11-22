"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Lightbulb, Rocket, Users, Award, Code, Zap } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function InnovationPage() {
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
            <Button className="bg-[#be2e38] hover:bg-[#a0252e] h-12 px-8 text-base">
              <Rocket className="mr-2 h-5 w-5" />
              Submit Your Project
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

        <div>
          <h2 className="text-2xl font-bold text-[#0a1628] mb-4">Featured Student Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#0a1628]">AI-Powered Resume Analyzer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  ML model that analyzes resumes and provides ATS optimization suggestions. Built with Python,
                  TensorFlow, and React.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">Machine Learning</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">React</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Project
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-[#0a1628]">Campus Navigation AR App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Augmented reality mobile app for navigating the campus. Uses ARCore and real-time pathfinding
                  algorithms.
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">AR/VR</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-700">Mobile</span>
                  </div>
                  <Button variant="outline" size="sm">
                    View Project
                  </Button>
                </div>
              </CardContent>
            </Card>
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
