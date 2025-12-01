import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import {
  ArrowRight,
  Calendar,
  Briefcase,
  Award,
  Lightbulb,
  ShieldCheck,
  Users,
  Globe,
  GraduationCap,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero Section - RSA Style: Dark, Bold, Corporate */}
      <section className="relative bg-[#0a1628] text-white py-24 md:py-32 overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-500 blur-[100px]" />
          <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-[#be2e38] blur-[100px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              Empowering the <br />
              <span className="text-[#be2e38]">Next Generation</span> of Innovators.
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl leading-relaxed">
              The CSE Innovation Hub is the central platform for students to access world-class opportunities, manage
              academic growth, and secure their future in technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button className="h-14 px-8 text-lg bg-[#be2e38] hover:bg-[#a0252e] text-white rounded-none w-full sm:w-auto">
                  Join the Hub
                </Button>
              </Link>
              <Link href="/login" prefetch={false}>
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-[#0a1628] rounded-none w-full sm:w-auto bg-transparent"
                >
                  Login
                </Button>
              </Link>
              <Link href="/login?admin=1" prefetch={false}>
                <Button
                  variant="outline"
                  className="h-14 px-8 text-lg border-white text-white hover:bg-white hover:text-[#0a1628] rounded-none w-full sm:w-auto bg-transparent"
                >
                  Admin Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#be2e38] py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-sm uppercase tracking-wider opacity-80">Active Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-sm uppercase tracking-wider opacity-80">Corporate Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-sm uppercase tracking-wider opacity-80">Placement Support</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-sm uppercase tracking-wider opacity-80">Resource Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions/Features Grid */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0a1628] mb-4">Comprehensive Student Resources</h2>
            <p className="text-gray-600 text-lg">
              Everything you need to succeed in your Computer Science journey, all in one secure platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-[#be2e38]">
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#be2e38] transition-colors">
                <Calendar className="h-6 w-6 text-[#be2e38] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-3">Academic Events</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Stay updated with the latest workshops, seminars, and hackathons organized by the department.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center text-[#be2e38] font-semibold hover:gap-2 transition-all"
              >
                View Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-[#0a1628]">
              <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#0a1628] transition-colors">
                <Briefcase className="h-6 w-6 text-[#0a1628] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-3">Career Opportunities</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Exclusive access to internship and job listings from top tech companies and startups.
              </p>
              <Link
                href="/jobs"
                className="inline-flex items-center text-[#0a1628] font-semibold hover:gap-2 transition-all"
              >
                Find Jobs <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-300 border-t-4 border-[#be2e38]">
              <div className="h-12 w-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#be2e38] transition-colors">
                <Award className="h-6 w-6 text-[#be2e38] group-hover:text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#0a1628] mb-3">Placement Cell</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Comprehensive guidelines, preparation materials, and support for your placement journey.
              </p>
              <Link
                href="/placements"
                className="inline-flex items-center text-[#be2e38] font-semibold hover:gap-2 transition-all"
              >
                Get Prepared <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-24 bg-[#0a1628] text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="inline-block px-4 py-1 bg-[#be2e38]/20 text-[#be2e38] font-bold text-sm rounded-full mb-6 border border-[#be2e38]/50">
                FUTURE READY
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                Where Ideas Meet <br />
                <span className="text-[#be2e38]">Execution</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                The Innovation Hub isn't just a portal; it's a launchpad. We provide the infrastructure for students to
                showcase projects, collaborate on research, and turn theoretical knowledge into practical solutions.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white/10 p-2 rounded">
                    <Lightbulb className="h-5 w-5 text-[#be2e38]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Project Showcase</h4>
                    <p className="text-gray-400">Display your final year projects to recruiters and faculty.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-white/10 p-2 rounded">
                    <Users className="h-5 w-5 text-[#be2e38]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Collaborative Research</h4>
                    <p className="text-gray-400">Connect with peers for hackathons and research papers.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-1/2 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0a1628] to-transparent z-10" />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 mt-8">
                  <div className="h-48 bg-white/5 rounded-lg border border-white/10 p-6 flex flex-col justify-end">
                    <ShieldCheck className="h-8 w-8 text-[#be2e38] mb-2" />
                    <span className="font-bold">Secure Access</span>
                  </div>
                  <div className="h-64 bg-white/5 rounded-lg border border-white/10 p-6 flex flex-col justify-end">
                    <Globe className="h-8 w-8 text-[#be2e38] mb-2" />
                    <span className="font-bold">Global Reach</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-64 bg-[#be2e38] rounded-lg p-6 flex flex-col justify-end text-white">
                    <Award className="h-8 w-8 text-white mb-2" />
                    <span className="font-bold">Excellence</span>
                  </div>
                  <div className="h-48 bg-white/5 rounded-lg border border-white/10 p-6 flex flex-col justify-end">
                    <Users className="h-8 w-8 text-[#be2e38] mb-2" />
                    <span className="font-bold">Community</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#050b14] text-gray-400 py-12 border-t border-white/10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#be2e38]">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">CSE Innovation Hub</span>
              </div>
              <p className="max-w-sm">
                Department of Computer Science & Engineering. <br />
                Empowering students with technology and innovation.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/events" className="hover:text-[#be2e38] transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-[#be2e38] transition-colors">
                    Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/placements" className="hover:text-[#be2e38] transition-colors">
                    Placements
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>cse.dept@college.edu</li>
                <li>+1 (555) 123-4567</li>
                <li>Tech Campus, Block C</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2025 CSE Innovation Hub. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-white">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
