"use client"

import Link from "next/link"
import { Bus, Search, MapPin, Users, MessageSquare, UserCircle, ArrowRight, CheckCircle, Smartphone, Clock, Shield, Zap, Star, TrendingUp, Award, Target, Heart } from "lucide-react"
import Image from "next/image"
import ProfessionalNav from "@/components/shared/ProfessionalNav"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <ProfessionalNav currentPage="home" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 pt-32 pb-20">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-white animate-fade-in-up">
              <div className="inline-block mb-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-semibold">
                  <Star className="h-4 w-4 text-yellow-300" />
                  #1 Bus Travel Platform in Kerala
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 md:mb-6">
                Real-Time Bus
                <br />
                <span className="text-yellow-300 animate-pulse">Tracking Made</span>
                <br />
                Simple
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 md:mb-8 max-w-xl leading-relaxed">
                Find travel companions, coordinate with friends, and never travel alone again. The community-powered bus travel platform for Kerala.
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm">Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm">Community verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-green-400 flex-shrink-0" />
                  <span className="text-xs md:text-sm">Real-time updates</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link
                  href="/search-bus"
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-blue-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105 hover:-translate-y-1"
                >
                  <Search className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform" />
                  Search Routes
                  <ArrowRight className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                {/* <button className="group inline-flex items-center gap-2 rounded-full border-2 border-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold text-white hover:bg-white/10 transition-all hover:scale-105">
                  <Smartphone className="h-4 w-4 md:h-5 md:w-5 group-hover:rotate-12 transition-transform" />
                  Download App
                </button> */}
              </div>
              <p className="text-sm text-blue-200 mt-6">
                Join 10,000+ students already using BusUndo
              </p>
            </div>
            <div className="relative animate-fade-in-up animation-delay-200 flex justify-center md:justify-end mt-8 md:mt-0">
              <div className="relative w-52 sm:w-56 md:w-60 lg:w-72 h-[460px] sm:h-[480px] md:h-[500px] lg:h-[580px] bg-gradient-to-br from-blue-500 to-blue-600 rounded-[3rem] shadow-2xl p-3 transform hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-white rounded-[2.5rem] flex items-center justify-center overflow-hidden">
                  <div className="text-center p-6 sm:p-8">
                    <div className="relative mb-4">
                      <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                      {/* <Image 
                        src="/logo/Busundo-Icon.png" 
                        alt="Busundo" 
                        width={64} 
                        height={64}
                        className="relative mx-auto animate-bounce rounded-lg"
                      /> */}
                    </div>
                <Image 
                      src="/logo/Busundo-horizontal.png" 
                      alt="Busundo" 
                      width={200} 
                      height={50}
                      className="mx-auto mb-2"
                    />
                    <p className="text-sm text-gray-500 mt-2">Live Tracking</p>
                    <div className="mt-6 space-y-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full animate-progress" style={{width: '70%'}}></div>
                      </div>
                      <p className="text-xs text-gray-400">Route: Thrissur → Kochi</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Floating elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-3 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-semibold text-gray-700">Live</span>
                  </div>
                </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-3 animate-float animation-delay-1000">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700">3 Pools</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-blue-600 font-semibold mb-4 uppercase tracking-wide">Features</p>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">Smarter Commutes</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than just bus schedules. We help you travel together.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Real-time Bus Tracking</h3>
              <p className="text-gray-600 mb-4">
                Track your bus in real-time and never miss your ride. Get live updates on bus locations and arrival times.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Live GPS tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Arrival time predictions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Route notifications
                </li>
              </ul>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-pink-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">Ride Pooling</h3>
              <p className="text-gray-600 mb-4">
                Share rides with fellow commuters. Save money, reduce traffic, and make new friends on your daily commute.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Save up to 70% on travel
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Verified pool members
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Daily commute pools
                </li>
              </ul>
            </div>

            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-orange-200">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">Community Groups</h3>
              <p className="text-gray-600 mb-4">
                Join route-based communities. Share updates, ask questions, and stay connected with your fellow travelers.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Route-based groups
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Real-time updates
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Community support
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative order-2 md:order-1">
              <div className="relative mx-auto w-52 sm:w-56 md:w-60 lg:w-64 h-[450px] sm:h-[480px] md:h-[500px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-[3rem] shadow-2xl p-3">
                <div className="w-full h-full bg-white rounded-[2.5rem] flex items-center justify-center">
                  <div className="text-center p-8">
                    <MapPin className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                    <p className="text-lg font-bold text-gray-800">Live Tracking</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <p className="text-blue-400 font-semibold mb-4">FEATURES</p>
              <h2 className="text-4xl font-bold mb-8">
                Experience Evide <span className="text-blue-400">in Action</span>
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Real-time Updates</h3>
                    <p className="text-gray-300">Get instant notifications about bus arrivals, delays, and route changes.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Safe & Secure</h3>
                    <p className="text-gray-300">Verified users and secure ride pooling for your peace of mind.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                    <p className="text-gray-300">Quick search, instant results, and seamless booking experience.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/logo/Busundo banner.png" 
              alt="Busundo - Travel Together. Travel Smart." 
              width={1200} 
              height={400}
              className="w-full h-auto"
              priority
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            *Remember, ours is <span className="font-bold text-blue-600">BusUndo.com</span>
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Travelling Together?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join the BusUndo community today and never travel alone again.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/search-bus"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            >
              Get Started <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="inline-flex items-center gap-2 rounded-full border-2 border-white px-8 py-4 text-lg font-semibold text-white hover:bg-white/10 transition-all">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="mb-4">
                <Image
                  src="/logo/Busundo-horizontal.png"
                  alt="Busundo"
                  width={180}
                  height={45}
                  className="brightness-200"
                />
              </div>
              <p className="text-sm text-gray-400">
                Making bus travel smarter, safer, and more social for Kerala students.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search-bus" className="hover:text-white transition-colors">Search Routes</Link></li>
                <li><Link href="/pools" className="hover:text-white transition-colors">Ride Pooling</Link></li>
                <li><Link href="/communities" className="hover:text-white transition-colors">Communities</Link></li>
                <li><Link href="/circles" className="hover:text-white transition-colors">Travel Circles</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Connect</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 BusUndo. All rights reserved. Built by <span className="font-semibold text-white">Bodheesh VC</span>. Made with ❤️ for Kerala.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
