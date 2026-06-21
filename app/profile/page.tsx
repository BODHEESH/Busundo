"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  Mail,
  Shield,
  Calendar,
  LogOut,
  MapPin,
  Clock,
  User as UserIcon,
} from "lucide-react"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto" />
          <div className="h-6 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </main>
    )
  }

  if (status === "unauthenticated") {
    router.push("/login")
    return null
  }

  const user = session?.user as any
  const initials = user?.name?.charAt(0)?.toUpperCase() || "?"
  const role = user?.role || "user"
  const isGoogle = !user?.image?.includes("Busundo-Icon")

  const joinedDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8 pb-16">
        {/* Header */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center gap-4">
            {user?.image ? (
              <Image
                src={user.image}
                alt={user.name || "User"}
                width={72}
                height={72}
                className="rounded-full object-cover border-2 border-gray-100"
                unoptimized
              />
            ) : (
              <span className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-blue-600 text-white text-2xl font-bold">
                {initials}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {user?.name || "User"}
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                <Mail className="h-4 w-4" />
                <span className="truncate">{user?.email}</span>
              </p>
              <span className="inline-flex mt-2 items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700 capitalize">
                <Shield className="h-3 w-3" />
                {role}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-4">
            Account Details
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Display Name</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {user?.name || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Email</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {user?.email || "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Role</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 capitalize">
                {role}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Sign-in Method</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {isGoogle ? "Google" : "Email & Password"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">Member Since</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {joinedDate}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">User ID</span>
              </div>
              <span className="text-xs font-mono text-gray-500 truncate max-w-[180px]">
                {user?.id}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button
            onClick={() => router.push("/")}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:border-blue-300 transition-colors"
          >
            <MapPin className="h-5 w-5 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">Explore</span>
          </button>
          <button
            onClick={() => router.push("/search-bus")}
            className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm hover:border-blue-300 transition-colors"
          >
            <Clock className="h-5 w-5 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-700">
              Search Buses
            </span>
          </button>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </main>
  )
}
