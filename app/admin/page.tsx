import Link from "next/link";
import { Bus, MapPin, Users, BarChart3, MessageSquare } from "lucide-react";
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
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/admin/routes/add"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-blue-200"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md group-hover:scale-110 transition-transform mb-6">
              <Bus className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">Add Route</h3>
            <p className="text-gray-600 leading-relaxed">
              Create new bus route in 30 seconds
            </p>
          </Link>

          <Link
            href="/admin/stops/add"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-green-200"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md group-hover:scale-110 transition-transform mb-6">
              <MapPin className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-green-600 transition-colors">Add Stop</h3>
            <p className="text-gray-600 leading-relaxed">
              Add new bus stop to database
            </p>
          </Link>

          <Link
            href="/admin/routes"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-purple-200"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md group-hover:scale-110 transition-transform mb-6">
              <BarChart3 className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">View Routes</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage all bus routes
            </p>
          </Link>

          <Link
            href="/admin/stops"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-pink-200"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md group-hover:scale-110 transition-transform mb-6">
              <Users className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-pink-600 transition-colors">View Stops</h3>
            <p className="text-gray-600 leading-relaxed">
              Manage all bus stops
            </p>
          </Link>

          <Link
            href="/admin/suggestions"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-orange-200"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md group-hover:scale-110 transition-transform mb-6">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-orange-600 transition-colors">Suggestions</h3>
            <p className="text-gray-600 leading-relaxed">
              Review community suggestions
            </p>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Routes</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">20</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                <Bus className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Stops</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">68</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md">
                <MapPin className="h-8 w-8" />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Coverage</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">5</p>
                <p className="text-sm text-gray-400 mt-1">Taluks</p>
              </div>
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md">
                <BarChart3 className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
