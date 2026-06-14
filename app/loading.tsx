"use client"

import { Bus } from "lucide-react"

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <Bus className="relative h-12 w-12 text-blue-600 animate-bounce" />
      </div>
      <p className="mt-4 text-sm font-medium text-gray-600 animate-pulse">Loading...</p>
    </div>
  )
}
