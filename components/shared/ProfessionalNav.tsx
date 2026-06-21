"use client"

import Link from "next/link"
import Image from "next/image"
import { Bus, Search, Users, MessageSquare, UserCircle, Settings, ChevronDown, Flame, Package, Heart, TrendingUp, Menu, X, Compass, LogOut, LogIn, User } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

interface ProfessionalNavProps {
  currentPage?: string
}

export default function ProfessionalNav({ currentPage }: ProfessionalNavProps) {
  const { data: session, status } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showFeaturesDropdown, setShowFeaturesDropdown] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)

  const userRole = (session?.user as any)?.role
  const isAdmin = ['admin', 'superadmin'].includes(userRole)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowFeaturesDropdown(false)
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'bg-white backdrop-blur-md border-b border-gray-200 shadow-lg'
        : 'bg-white border-b border-gray-200'
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
          <div className="flex items-center gap-3 lg:gap-6">
            <Link
              href="/search-bus"
              prefetch={true}
              className={`hidden lg:block text-xs lg:text-sm font-medium transition-colors ${
                currentPage === 'search' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Search
            </Link>
            <Link
              href="/explore"
              prefetch={true}
              className={`hidden lg:block text-xs lg:text-sm font-medium transition-colors ${
                currentPage === 'explore' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Explore
            </Link>
            <Link
              href="/pools"
              prefetch={true}
              className={`hidden lg:block text-xs lg:text-sm font-medium transition-colors ${
                currentPage === 'pools' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Ride Pooling
            </Link>
            <Link
              href="/communities"
              prefetch={true}
              className={`hidden lg:block text-xs lg:text-sm font-medium transition-colors ${
                currentPage === 'communities' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Communities
            </Link>
            <Link
              href="/circles"
              prefetch={true}
              className={`hidden lg:block text-xs lg:text-sm font-medium transition-colors ${
                currentPage === 'circles' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Circles
            </Link>
            <Link
              href="/contribute"
              prefetch={true}
              className={`hidden lg:block text-xs lg:text-sm font-medium transition-colors ${
                currentPage === 'contribute' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Contribute
            </Link>
            
            {/* Features Dropdown */}
            <div ref={dropdownRef} className="hidden lg:block relative">
              <button
                onClick={() => setShowFeaturesDropdown(!showFeaturesDropdown)}
                className="flex items-center gap-1 text-xs lg:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Features
                <ChevronDown className={`h-4 w-4 transition-transform ${showFeaturesDropdown ? 'rotate-180' : ''}`} />
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
            {status === "authenticated" && session?.user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden lg:flex items-center gap-2 rounded-lg border-2 border-gray-300 px-2 lg:px-3 py-1.5 lg:py-2 text-xs lg:text-sm font-medium text-gray-600 hover:border-blue-600 hover:text-blue-600 transition-all"
                    title="Admin Dashboard"
                  >
                    <Settings className="h-3 lg:h-4 w-3 lg:w-4" />
                  </Link>
                )}
                {/* User Dropdown */}
                <div ref={userDropdownRef} className="hidden lg:block relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 rounded-full bg-blue-50 hover:bg-blue-100 px-3 py-2 transition-colors"
                  >
                    <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700 max-w-[80px] truncate">
                      {session.user.name}
                    </span>
                    <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="font-semibold text-gray-900 truncate">{session.user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                        {userRole && (
                          <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 capitalize">
                            {userRole}
                          </span>
                        )}
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                      >
                        <User className="h-5 w-5 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Profile</span>
                      </Link>
                      <Link
                        href="/my-busundo"
                        onClick={() => setShowUserDropdown(false)}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                      >
                        <Flame className="h-5 w-5 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">My Busundo</span>
                      </Link>
                      {isAdmin && (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                          >
                            <Settings className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Admin Dashboard</span>
                          </Link>
                          <Link
                            href="/admin/users"
                            onClick={() => setShowUserDropdown(false)}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 transition-colors"
                          >
                            <Users className="h-5 w-5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Users Management</span>
                          </Link>
                        </>
                      )}
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setShowUserDropdown(false)
                            signOut({ callbackUrl: '/' })
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="h-5 w-5 text-red-500" />
                          <span className="text-sm font-medium text-red-600">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden lg:flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-xs lg:text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex rounded-full bg-blue-600 px-4 lg:px-6 py-2 lg:py-2.5 text-xs lg:text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
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
        <div className="lg:hidden bg-gradient-to-r from-blue-700 to-blue-800 border-t border-blue-600">
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
              href="/explore"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-lg transition-colors ${
                currentPage === 'explore' ? 'bg-white/20 text-yellow-300' : 'text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Compass className="h-5 w-5" />
                <span className="font-medium">Explore</span>
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
            
            {/* Mobile Auth Section */}
            <div className="pt-2 border-t border-blue-600">
              <p className="px-4 py-2 text-xs font-semibold text-blue-200 uppercase tracking-wide">Account</p>
              {status === "authenticated" && session?.user ? (
                <>
                  <div className="px-4 py-3 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center">
                      <User className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">{session.user.name}</p>
                      <p className="text-xs text-blue-200">{session.user.email}</p>
                      {userRole && (
                        <span className="inline-block mt-0.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white capitalize">
                          {userRole}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5" />
                      <span className="font-medium">Profile</span>
                    </div>
                  </Link>
                  {isAdmin && (
                    <>
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Settings className="h-5 w-5" />
                          <span className="font-medium">Admin Dashboard</span>
                        </div>
                      </Link>
                      <Link
                        href="/admin/users"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Users className="h-5 w-5" />
                          <span className="font-medium">Users Management</span>
                        </div>
                      </Link>
                    </>
                  )}
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="w-full block px-4 py-3 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <LogOut className="h-5 w-5" />
                      <span className="font-medium">Sign Out</span>
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-lg text-white hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <LogIn className="h-5 w-5" />
                      <span className="font-medium">Sign In</span>
                    </div>
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block mt-2 px-6 py-3 rounded-full bg-white text-blue-700 font-semibold text-center shadow-lg"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
