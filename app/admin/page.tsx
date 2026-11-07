import Link from "next/link";
import { Bus, MapPin, Users, BarChart3, MessageSquare, Shield } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

export default function AdminDashboard() {
  return (
    <PageWrapper
      currentPage="admin"
      title="Admin Dashboard"
      description="Manage bus stops, routes, and community suggestions"
      gradient={true}
    >
      <div className="mx-auto max-w-6xl px-4">

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/routes/add"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-4">
              <Bus className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Add Route</h3>
            <p className="text-sm text-gray-600">
              Create new bus route in 30 seconds
            </p>
          </Link>

          <Link
            href="/admin/stops/add"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 mb-4">
              <MapPin className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Add Stop</h3>
            <p className="text-sm text-gray-600">
              Add new bus stop to database
            </p>
          </Link>

          <Link
            href="/admin/review"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 mb-4">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Review Submissions</h3>
            <p className="text-sm text-gray-600">
              Approve or reject routes and timings sent by contributors
            </p>
          </Link>

          <Link
            href="/admin/timings"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 mb-4">
              <Bus className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Live Timings</h3>
            <p className="text-sm text-gray-600">
              Correct departure times on routes that are already live
            </p>
          </Link>

          <Link
            href="/admin/routes"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">View Routes</h3>
            <p className="text-sm text-gray-600">
              Manage all bus routes
            </p>
          </Link>

          <Link
            href="/admin/stops"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 mb-4">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">View Stops</h3>
            <p className="text-sm text-gray-600">
              Manage all bus stops
            </p>
          </Link>

          <Link
            href="/admin/suggestions"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-blue-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50 mb-4">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">Suggestions</h3>
            <p className="text-sm text-gray-600">
              Review community suggestions
            </p>
          </Link>

          <Link
            href="/admin/users"
            className="group block rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:border-purple-500"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 mb-4">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">Users</h3>
            <p className="text-sm text-gray-600">
              Manage users, roles &amp; permissions
            </p>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Routes</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">20</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Bus className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Stops</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">68</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Coverage</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-400 mt-1">Taluks</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
