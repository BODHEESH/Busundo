"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { Bus, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { status } = useSession()

  useEffect(() => {
    if (status === "authenticated") {
      router.push(callbackUrl)
      router.refresh()
    }
  }, [status, callbackUrl, router])

  const [mounted, setMounted] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpStep, setOtpStep] = useState<"email" | "code">("email")
  const [otpEmail, setOtpEmail] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [otpBusy, setOtpBusy] = useState(false)

  useEffect(() => {
    setMounted(true)
    const oauthError = searchParams.get("error")
    if (oauthError) {
      setError(
        oauthError === "OAuthAccountNotLinked"
          ? "This email is already registered. Please sign in with your original method."
          : "Google sign-in failed. Please try again."
      )
    }
  }, [searchParams])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else {
        toast.success("Signed in successfully!")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const requestCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpBusy(true)
    setError("")
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: otpEmail }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Could not send the code")
        return
      }
      setOtpStep("code")
      toast.success("Code sent. Check your inbox.")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setOtpBusy(false)
    }
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setOtpBusy(true)
    setError("")
    try {
      const result = await signIn("otp", {
        redirect: false,
        email: otpEmail,
        code: otpCode,
      })
      if (result?.error) {
        setError("That code is wrong or has expired.")
        return
      }
      toast.success("Signed in successfully!")
      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setOtpBusy(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl })
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12" suppressHydrationWarning>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <Bus className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to BusUndo
          </h1>
          <p className="text-gray-600">
            Sign in to access your account
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          {mounted ? (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-3 rounded-xl border-2 border-gray-200 bg-white py-3 px-4 text-sm font-semibold text-gray-700 transition hover:border-blue-300 hover:bg-blue-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-gray-700">Sign in with an email code</p>
                {otpStep === "email" ? (
                  <form onSubmit={requestCode} className="space-y-3">
                    <input
                      type="email"
                      value={otpEmail}
                      onChange={(e) => setOtpEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    <button
                      type="submit"
                      disabled={otpBusy}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {otpBusy ? "Sending..." : "Send code"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={verifyCode} className="space-y-3">
                    <p className="text-xs text-gray-500">
                      We sent a 6-digit code to {otpEmail}.{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep("email")
                          setOtpCode("")
                          setError("")
                        }}
                        className="text-blue-600 hover:underline"
                      >
                        Use a different email
                      </button>
                    </p>
                    <input
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      required
                      placeholder="123456"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl tracking-widest text-center text-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    <button
                      type="submit"
                      disabled={otpBusy || otpCode.length !== 6}
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {otpBusy ? "Checking..." : "Verify and sign in"}
                    </button>
                  </form>
                )}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">OR SIGN IN WITH PASSWORD</span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-600 font-semibold hover:text-blue-700">
                  Sign Up
                </Link>
              </p>
            </>
          ) : (
            <div className="space-y-4 animate-pulse">
              <div className="h-11 bg-gray-200 rounded-xl" />
              <div className="flex items-center gap-3 py-2">
                <div className="h-px flex-1 bg-gray-200" />
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="h-11 bg-gray-200 rounded-xl" />
              <div className="h-11 bg-gray-200 rounded-xl" />
              <div className="h-11 bg-gray-200 rounded-xl" />
              <div className="h-4 w-48 bg-gray-200 rounded mx-auto mt-4" />
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
