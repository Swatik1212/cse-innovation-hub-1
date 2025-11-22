"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GraduationCap, Menu, X } from "lucide-react"
import { useState } from "react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a1628] text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#be2e38]">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight">CSE</span>
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">Innovation Hub</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/events" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Events
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Jobs
            </Link>
            <Link href="/placements" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Placements
            </Link>
            <Link href="/innovation" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Innovation
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#be2e38] hover:bg-[#a0252e] text-white rounded-none px-6">Get Started</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0a1628] p-4">
          <div className="flex flex-col space-y-4">
            <Link href="/events" className="text-sm font-medium text-gray-300">
              Events
            </Link>
            <Link href="/jobs" className="text-sm font-medium text-gray-300">
              Jobs
            </Link>
            <Link href="/placements" className="text-sm font-medium text-gray-300">
              Placements
            </Link>
            <Link href="/innovation" className="text-sm font-medium text-gray-300">
              Innovation
            </Link>
            <div className="pt-4 flex flex-col gap-2">
              <Link href="/login">
                <Button variant="ghost" className="w-full justify-start text-white">
                  Log In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="w-full bg-[#be2e38] hover:bg-[#a0252e]">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
