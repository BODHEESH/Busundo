import Link from "next/link";
import { Mail, GraduationCap, Star, ChevronRight, LogOut } from "lucide-react";
import { TopNav } from "@/components/nav";
import { StatusBadge } from "@/components/status-badge";
import { currentUser, mockRoutes, mockHistory } from "@/lib/mock-data";

export default function ProfilePage() {
  const favoriteRoutes = mockRoutes.filter((r) =>
    currentUser.favoriteRouteIds.includes(r.id)
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <TopNav back={{ href: "/dashboard", label: "Dashboard" }} />

      {/* Profile header */}
      <section className="flex items-center gap-4 py-6">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-transit font-display text-2xl font-bold text-paper">
          {currentUser.initial}
        </span>
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight">
            {currentUser.name}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/50">
            <Mail className="h-3.5 w-3.5" /> {currentUser.email}
          </p>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-ink/50">
            <GraduationCap className="h-3.5 w-3.5" /> {currentUser.college}
          </p>
        </div>
      </section>

      {/* Favorite routes */}
      <section className="mt-2">
        <h2 className="mb-3 font-display text-base font-bold">Favourite routes</h2>
        <div className="space-y-3">
          {favoriteRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/routes/${route.id}`}
              className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4 transition hover:border-transit"
            >
              <div className="flex items-center gap-3">
                <Star className="h-4 w-4 fill-signal text-signal" />
                <div>
                  <p className="font-display text-sm font-semibold">
                    {route.source} → {route.destination}
                  </p>
                  <p className="text-xs text-ink/50 tabular">
                    {route.duration} · {route.stops.length} stops
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-ink/30" />
            </Link>
          ))}
        </div>
      </section>

      {/* Travel history */}
      <section className="mt-8">
        <h2 className="mb-3 font-display text-base font-bold">Travel history</h2>
        <div className="overflow-hidden rounded-xl2 border border-line bg-white">
          {mockHistory.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center justify-between p-4 ${
                i !== mockHistory.length - 1 ? "border-b border-line" : ""
              }`}
            >
              <div>
                <p className="text-sm font-medium">{entry.routeLabel}</p>
                <p className="mt-0.5 text-xs text-ink/40">{entry.date}</p>
              </div>
              <StatusBadge status={entry.status} />
            </div>
          ))}
        </div>
      </section>

      <button className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-line py-3 text-sm font-semibold text-ink/60 hover:border-signal hover:text-signal">
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </main>
  );
}
