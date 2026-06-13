import Link from "next/link";
import { Search, MapPin, Users, ChevronRight, Clock, Bus, Bell } from "lucide-react";
import { Logo } from "@/components/nav";
import { mockRoutes, mockGroups, currentUser } from "@/lib/mock-data";
import { StatusBadge } from "@/components/status-badge";

export default function DashboardPage() {
  const recentRoutes = mockRoutes;
  const activeGroups = mockGroups.filter((g) =>
    g.members.some((m) => m.isYou)
  );

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <header className="flex items-center justify-between py-5 animate-fade-in">
        <Logo />
        <div className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full bg-paper border border-line hover:border-transit transition-all"
          >
            <Bell className="h-4 w-4 text-ink/60" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-signal text-[10px] font-bold text-white flex items-center justify-center">
              2
            </span>
          </Link>
          <Link
            href="/profile"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-transit font-display text-sm font-bold text-paper hover:bg-transit-dark transition-all"
          >
            {currentUser.initial}
          </Link>
        </div>
      </header>

      <section className="pt-2 animate-slide-in-up">
        <p className="text-sm text-ink/50">Good morning</p>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {currentUser.name.split(" ")[0]}, where are you headed?
        </h1>
      </section>

      <section className="mt-5 rounded-xl2 border border-line bg-white p-4 shadow-sm animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
        <form action="/search" className="space-y-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-transit" />
            <input
              name="from"
              defaultValue="Aluva"
              placeholder="Leaving from"
              className="w-full rounded-lg border border-line bg-paper py-3 pl-8 pr-3 text-sm outline-none focus:border-transit"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-signal" />
            <input
              name="to"
              defaultValue="Kakkanad"
              placeholder="Going to"
              className="w-full rounded-lg border border-line bg-paper py-3 pl-8 pr-3 text-sm outline-none focus:border-transit"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg gradient-travel py-3 text-sm font-semibold text-paper hover:opacity-90 transition-all shadow-sm"
          >
            <Bus className="h-4 w-4 animate-bus-bounce" />
            Find travel groups
          </button>
        </form>
      </section>

      <section className="mt-8 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold flex items-center gap-2">
            <Bus className="h-5 w-5 text-transit" />
            Your active groups
          </h2>
        </div>
        <div className="space-y-3">
          {activeGroups.map((group) => {
            const route = mockRoutes.find((r) => r.id === group.routeId)!;
            const you = group.members.find((m) => m.isYou)!;
            return (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4 transition-all hover:border-transit hover:shadow-md hover:scale-[1.02]"
              >
                <div>
                  <p className="font-display text-sm font-semibold">
                    {route.source} → {route.destination}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-ink/50">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {group.departureTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" /> {group.members.length}/
                      {group.capacity}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={you.status} />
                  <ChevronRight className="h-4 w-4 text-ink/30" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
        <h2 className="mb-3 font-display text-base font-bold flex items-center gap-2">
          <MapPin className="h-5 w-5 text-signal" />
          Recent routes
        </h2>
        <div className="space-y-3">
          {recentRoutes.map((route) => (
            <Link
              key={route.id}
              href={`/routes/${route.id}`}
              className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4 transition-all hover:border-transit hover:shadow-md hover:scale-[1.02]"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-paper">
                  <MapPin className="h-4 w-4 text-transit" />
                </span>
                <div>
                  <p className="font-display text-sm font-semibold">
                    {route.source} → {route.destination}
                  </p>
                  <p className="text-xs text-ink/50 tabular">
                    {route.duration} · {route.distance} · {route.stops.length} stops
                  </p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-ink/30" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
