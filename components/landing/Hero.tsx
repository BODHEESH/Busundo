"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bus, Users, MapPin } from "lucide-react"

export default function Hero() {
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
            <span className="text-blue-600">Open Busundo.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Find travel companions, coordinate with friends, and never travel alone again.
            The community-powered bus travel platform for Kerala students.
          </p>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex-1">
                <Input 
                  type="text" 
                  placeholder="From: Aluva, Kakkanad..." 
                  className="h-12 text-lg"
                />
              </div>
              <div className="flex-1">
                <Input 
                  type="text" 
                  placeholder="To: Ernakulam, Kochi..." 
                  className="h-12 text-lg"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Search Routes
              </Button>
            </div>
          </div>

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
