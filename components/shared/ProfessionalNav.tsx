"use client"

import Link from "next/link"
import Image from "next/image"
import { Bus, Search, Users, MessageSquare, UserCircle, Settings, ChevronDown, Flame, Package, Heart, TrendingUp, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

interface ProfessionalNavProps {
  currentPage?: string
}

export default function ProfessionalNav({ currentPage }: ProfessionalNavProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
        ? 'bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-md border-b border-blue-800 shadow-lg' 
        : 'bg-gradient-to-r from-blue-600 to-blue-700 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            {/* Mobile Logo */}
            <Image 
              src="/logo/Busundo-horizontal.png" 
              alt="Busundo" 
              width={120} 
              height={30}
              className="md:hidden"
            />
            {/* Desktop Logo */}
            <Image 
              src="/logo/Busundo-horizontal.png" 
              alt="Busundo" 
              width={200} 
              height={50}
              className="hidden md:block"
            />
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
              href="/contribute" 
              className={`hidden md:block text-sm font-medium transition-colors ${
                currentPage === 'contribute' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contribute
            </Link>
            
            {/* Features Dropdown */}
            <div 
              className="hidden md:block relative"
              onMouseEnter={() => setShowFeaturesDropdown(true)}
              onMouseLeave={() => setShowFeaturesDropdown(false)}
            >
              <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">
                Features
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {showFeaturesDropdown && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fade-in">
                  <Link 
                    href="/my-busundo" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-gray-900">My Busundo</p>
                      <p className="text-xs text-gray-500">Scores, Streaks & Wrapped</p>
                    </div>
                  </Link>
                  <Link 
                    href="/crowd-meter" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <TrendingUp className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Crowd Meter</p>
                      <p className="text-xs text-gray-500">Live bus crowd levels</p>
                    </div>
                  </Link>
                  <Link 
                    href="/lost-found" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <Package className="h-5 w-5 text-pink-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Lost & Found</p>
                      <p className="text-xs text-gray-500">Community help network</p>
                    </div>
                  </Link>
                  <Link 
                    href="/buddy-match" 
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                  >
                    <Heart className="h-5 w-5 text-rose-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Bus Buddy Match</p>
                      <p className="text-xs text-gray-500">Find travel companions</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
            <Link
              href="/search-bus"
              className="hidden md:inline-flex rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              href="/admin"
              className="hidden md:flex items-center gap-2 rounded-lg border-2 border-white px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition-all"
              title="Admin Dashboard"
            >
              <Settings className="h-4 w-4" />
            </Link>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-r from-blue-700 to-blue-800 border-t border-blue-600">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/search-bus"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'search' ? 'bg-white/20 text-yellow-300' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5" />
                <span className="font-medium">Search</span>
              </div>
            </Link>
            
            <Link
              href="/pools"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'pools' ? 'bg-white/20 text-yellow-300' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5" />
                <span className="font-medium">Ride Pooling</span>
              </div>
            </Link>
            
            <Link
              href="/communities"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'communities' ? 'bg-white/20 text-yellow-300' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5" />
                <span className="font-medium">Communities</span>
              </div>
            </Link>
            
            <Link
              href="/circles"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'circles' ? 'bg-white/20 text-yellow-300' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <UserCircle className="h-5 w-5" />
                <span className="font-medium">Circles</span>
              </div>
            </Link>
            
            <Link
              href="/contribute"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'contribute' ? 'bg-white/20 text-yellow-300' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5" />
                <span className="font-medium">Contribute</span>
              </div>
            </Link>
            
            {/* Mobile Features Section */}
            <div className="pt-2 border-t border-blue-600">
              <p className="px-4 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wide">Features</p>
              
              <Link
                href="/my-busundo"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Flame className="h-5 w-5 text-orange-400" />
                  <div>
                    <p className="font-medium">My Busundo</p>
                    <p className="text-xs text-blue-200">Scores, Streaks & Wrapped</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/crowd-meter"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-red-400" />
                  <div>
                    <p className="font-medium">Crowd Meter</p>
                    <p className="text-xs text-blue-200">Live bus crowd levels</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/lost-found"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-5 w-5 text-pink-400" />
                  <div>
                    <p className="font-medium">Lost & Found</p>
                    <p className="text-xs text-blue-200">Community help network</p>
                  </div>
                </div>
              </Link>
              
              <Link
                href="/buddy-match"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="h-5 w-5 text-rose-400" />
                  <div>
                    <p className="font-medium">Bus Buddy Match</p>
                    <p className="text-xs text-blue-200">Find travel companions</p>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* Mobile CTA Button */}
            <Link
              href="/search-bus"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block mt-4 px-6 py-3 rounded-full bg-white text-blue-700 font-semibold text-center shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </Link>
            
            {/* Mobile Admin Link */}
            <Link
              href="/admin"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-4 py-3 rounded-lg border-2 border-white/30 text-white hover:bg-white/10 transition-colors text-center"
            >
              <div className="flex items-center justify-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="font-medium">Admin Dashboard</span>
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
