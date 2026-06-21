"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function AuthToast() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const hasShown = sessionStorage.getItem("busundo-auth-toast")
      if (!hasShown) {
        toast.success("Signed in successfully!", {
          description: `Welcome back, ${session.user.name || session.user.email}`,
          duration: 4000,
        })
        sessionStorage.setItem("busundo-auth-toast", "true")
      }
    }

    if (status === "unauthenticated") {
      sessionStorage.removeItem("busundo-auth-toast")
    }
  }, [status, session])

  return null
}
