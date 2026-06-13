"use client"

import Link from "next/link"
import Hero from "@/components/landing/Hero"
import Features from "@/components/landing/Features"
import HowItWorks from "@/components/landing/HowItWorks"
import Testimonials from "@/components/landing/Testimonials"
import CTA from "@/components/landing/CTA"
import Footer from "@/components/shared/Footer"
import { Bus, Search, Settings, MapPin, Route, Users, MessageSquare, UserCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-line">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-transit animate-bus-bounce">
                <Bus className="h-4 w-4 text-paper" />
              </span>
              <span className="font-display text-lg font-bold">Busundo</span>
            </Link>
            <div className="flex items-center gap-3">
              {/* User Navigation */}
              <Link
                href="/search-bus"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-all"
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              <Link
                href="/admin/routes"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-all"
              >
                <Route className="h-4 w-4" />
                Browse Routes
              </Link>
              <Link
                href="/admin/stops"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-all"
              >
                <MapPin className="h-4 w-4" />
                Bus Stops
              </Link>
              <Link
                href="/pools"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-all"
              >
                <Users className="h-4 w-4" />
                Pools
              </Link>
              <Link
                href="/communities"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-all"
              >
                <MessageSquare className="h-4 w-4" />
                Communities
              </Link>
              <Link
                href="/circles"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-ink transition-all"
              >
                <UserCircle className="h-4 w-4" />
                Circles
              </Link>
              
              {/* Divider */}
              <div className="hidden sm:block h-6 w-px bg-line" />
              
              {/* Primary CTA */}
              <Link
                href="/search-bus"
                className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg transition-all"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Find Your Bus</span>
                <span className="sm:hidden">Search</span>
              </Link>
              
              {/* Admin Link */}
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-medium hover:bg-gray-50 transition-all"
                title="Admin Dashboard"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden md:inline">Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="pt-16">
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
