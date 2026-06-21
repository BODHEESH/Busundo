"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Users, Search, Shield, User, Crown, Filter, ChevronLeft, ChevronRight, AlertTriangle, CheckCircle, XCircle, Edit3 } from "lucide-react"
import Link from "next/link"
import PageWrapper from "@/components/shared/PageWrapper"

interface UserData {
  _id: string
  name: string
  email: string
  phone?: string
  role: string
  isActive: boolean
  avatar?: string
  lastLoginAt?: string
  createdAt: string
  updatedAt: string
}

const ROLE_COLORS: Record<string, string> = {
  user: 'bg-gray-100 text-gray-700',
  moderator: 'bg-blue-100 text-blue-700',
  admin: 'bg-purple-100 text-purple-700',
  superadmin: 'bg-yellow-100 text-yellow-700',
}

const ROLE_ICONS: Record<string, any> = {
  user: User,
  moderator: Shield,
  admin: Shield,
  superadmin: Crown,
}

export default function AdminUsersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  // Redirect non-admin users
  useEffect(() => {
    if (status === "authenticated") {
      const userRole = (session?.user as any)?.role
      if (!['admin', 'superadmin'].includes(userRole)) {
        router.push("/")
      }
    } else if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/admin/users")
    }
  }, [session, status, router])

  // Fetch users
  useEffect(() => {
    if (status !== "authenticated") return

    const fetchUsers = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        params.set('page', page.toString())
        params.set('limit', '20')
        if (search) params.set('search', search)
        if (roleFilter) params.set('role', roleFilter)

        const res = await fetch(`/api/admin/users?${params.toString()}`)
        const data = await res.json()

        if (data.success) {
          setUsers(data.data)
          setTotalPages(data.pagination.totalPages)
          setTotalUsers(data.pagination.total)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError("Failed to fetch users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [page, search, roleFilter, status])

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUser(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })

      const data = await res.json()

      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u))
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to update user")
    } finally {
      setUpdatingUser(null)
    }
  }

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    setUpdatingUser(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !isActive }),
      })

      const data = await res.json()

      if (data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, isActive: !isActive } : u))
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to update user")
    } finally {
      setUpdatingUser(null)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (data.success) {
        setUsers(users.filter(u => u._id !== userId))
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError("Failed to delete user")
    }
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <PageWrapper currentPage="admin" title="Users Management" description="Manage all registered users">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="h-8 w-8 text-blue-600" />
              Users Management
            </h1>
            <p className="text-gray-600 mt-1">Total users: {totalUsers}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1) }}
              className="py-2 px-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600"
            >
              <option value="">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">User</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Email</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Role</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Joined</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => {
                      const RoleIcon = ROLE_ICONS[user.role] || User
                      return (
                        <tr key={user._id} className="hover:bg-blue-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <RoleIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-6 py-4">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user._id, e.target.value)}
                              disabled={updatingUser === user._id}
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 cursor-pointer ${ROLE_COLORS[user.role]}`}
                            >
                              <option value="user">User</option>
                              <option value="moderator">Moderator</option>
                              <option value="admin">Admin</option>
                              <option value="superadmin">Super Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleActive(user._id, user.isActive)}
                              disabled={updatingUser === user._id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                                user.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {user.isActive ? (
                                <>
                                  <CheckCircle className="h-3.5 w-3.5" />
                                  Active
                                </>
                              ) : (
                                <>
                                  <XCircle className="h-3.5 w-3.5" />
                                  Inactive
                                </>
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete user"
                              >
                                <AlertTriangle className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Back to Admin */}
        <div className="mt-6">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>
      </div>
    </PageWrapper>
  )
}
