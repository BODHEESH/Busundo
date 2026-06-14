"use client"

import { useState, useEffect, Suspense } from "react"
import { usePathname, useSearchParams } from "next/navigation"

function NavigationLoaderContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setIsLoading(true)
    setProgress(30)

    const timer1 = setTimeout(() => setProgress(60), 100)
    const timer2 = setTimeout(() => setProgress(80), 200)
    const timer3 = setTimeout(() => {
      setProgress(100)
      setTimeout(() => setIsLoading(false), 300)
    }, 300)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
    }
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-blue-100">
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default function NavigationLoader() {
  return (
    <Suspense fallback={null}>
      <NavigationLoaderContent />
    </Suspense>
  )
}
