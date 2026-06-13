"use client"

import Link from "next/link"
import { Bus, Search, Users, MessageSquare, UserCircle, Settings } from "lucide-react"
import { useState, useEffect } from "react"

interface ProfessionalNavProps {
  currentPage?: string
}

export default function ProfessionalNav({ currentPage }: ProfessionalNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg' 
        : 'bg-white/80 backdrop-blur-sm border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg">
              <Bus className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">BusUndo.com</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link 
              href="/search-bus" 
              className={`hidden md:block text-sm font-medium transition-colors ${
                currentPage === 'search' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Search
            </Link>
            <Link 
              href="/pools" 
              className={`hidden md:block text-sm font-medium transition-colors ${
                currentPage === 'pools' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Ride Pooling
            </Link>
            <Link 
              href="/communities" 
              className={`hidden md:block text-sm font-medium transition-colors ${
                currentPage === 'communities' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Communities
            </Link>
            <Link 
              href="/circles" 
              className={`hidden md:block text-sm font-medium transition-colors ${
                currentPage === 'circles' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Circles
            </Link>
            <Link
              href="/search-bus"
              className="rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2.5 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
              title="Admin Dashboard"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
