import Link from "next/link";
import { Bus, MapPin, Users, BarChart3, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-ink/60">
            Manage bus stops, routes, and community suggestions
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-in-up">
          <Link
            href="/admin/routes/add"
            className="group rounded-xl2 border border-line bg-white p-6 transition-all hover:border-transit hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10 mb-4">
              <Bus className="h-6 w-6 text-transit" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Add Route</h3>
            <p className="text-sm text-ink/60">
              Create new bus route in 30 seconds
            </p>
          </Link>

          <Link
            href="/admin/stops/add"
            className="group rounded-xl2 border border-line bg-white p-6 transition-all hover:border-transit hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 mb-4">
              <MapPin className="h-6 w-6 text-signal" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Add Stop</h3>
            <p className="text-sm text-ink/60">
              Add new bus stop to database
            </p>
          </Link>

          <Link
            href="/admin/routes"
            className="group rounded-xl2 border border-line bg-white p-6 transition-all hover:border-transit hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10 mb-4">
              <BarChart3 className="h-6 w-6 text-transit" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">View Routes</h3>
            <p className="text-sm text-ink/60">
              Manage all bus routes
            </p>
          </Link>

          <Link
            href="/admin/stops"
            className="group rounded-xl2 border border-line bg-white p-6 transition-all hover:border-transit hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal/10 mb-4">
              <Users className="h-6 w-6 text-signal" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">View Stops</h3>
            <p className="text-sm text-ink/60">
              Manage all bus stops
            </p>
          </Link>

          <Link
            href="/admin/suggestions"
            className="group rounded-xl2 border border-line bg-white p-6 transition-all hover:border-transit hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100 mb-4">
              <MessageSquare className="h-6 w-6 text-orange-600" />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">Suggestions</h3>
            <p className="text-sm text-ink/60">
              Review community suggestions
            </p>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid gap-6 md:grid-cols-3 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink/60">Total Routes</p>
                <p className="mt-1 font-display text-3xl font-bold">20</p>
              </div>
              <Bus className="h-8 w-8 text-transit/20" />
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink/60">Total Stops</p>
                <p className="mt-1 font-display text-3xl font-bold">68</p>
              </div>
              <MapPin className="h-8 w-8 text-signal/20" />
            </div>
          </div>

          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink/60">Coverage</p>
                <p className="mt-1 font-display text-3xl font-bold">5</p>
                <p className="text-xs text-ink/40">Taluks</p>
              </div>
              <BarChart3 className="h-8 w-8 text-transit/20" />
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8">
          <Link
            href="/"
            className="text-sm text-transit hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
