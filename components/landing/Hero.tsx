"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bus, Users, MapPin } from "lucide-react"

export default function Hero() {
  const router = useRouter()
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (from && to) {
      router.push(`/search-bus?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
    } else {
      router.push("/search-bus")
    }
  }
  return (
    <section className="relative bg-gradient-to-b from-blue-50 to-white py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Bus className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Bus Undo? <br />
            <span className="text-blue-600">Open BusUndo.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find travel companions, coordinate with friends, and never travel alone again.
            The community-powered bus travel platform for Kerala students.
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex-1">
                <Input 
                  type="text" 
                  placeholder="From: Mullassery, Chavakkad..." 
                  className="h-12 text-lg"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </div>
              <div className="flex-1">
                <Input 
                  type="text" 
                  placeholder="To: Thrissur, Kodungallur..." 
                  className="h-12 text-lg"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-12 px-8">
                Search Routes
              </Button>
            </div>
          </form>

          <div className="flex flex-wrap justify-center gap-8 text-gray-600">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Find Travel Groups</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <span>Discover Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <Bus className="w-5 h-5 text-blue-600" />
              <span>Travel Together</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
