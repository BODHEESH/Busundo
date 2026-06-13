import Link from "next/link";
import { ArrowRight, ChevronRight, Users, Clock3, Bus, MapPin } from "lucide-react";
import { TopNav } from "@/components/nav";
import { mockRoutes, mockGroups } from "@/lib/mock-data";

export default function SearchResultsPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string };
}) {
  const from = searchParams.from || "Aluva";
  const to = searchParams.to || "Kakkanad";

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <TopNav back={{ href: "/dashboard", label: "Dashboard" }} />

      <section className="py-5 animate-fade-in">
        <div className="flex items-center gap-2 rounded-xl2 border border-line glass p-4 shadow-sm">
          <div className="flex flex-1 items-center gap-2 text-sm font-medium">
            <span className="h-2 w-2 rounded-full bg-transit" />
            {from}
            <ArrowRight className="h-3.5 w-3.5 text-ink/30" />
            <span className="h-2 w-2 rounded-full bg-signal" />
            {to}
          </div>
          <Link
            href="/dashboard"
            className="text-xs font-semibold text-transit hover:underline"
          >
            Edit
          </Link>
        </div>
        <p className="mt-3 text-sm text-ink/50 flex items-center gap-2">
          <Bus className="h-4 w-4 text-transit" />
          {mockRoutes.length} routes found · sorted by departure time
        </p>
      </section>

      <section className="space-y-4 animate-slide-in-up">
        {mockRoutes.map((route, index) => {
          const groupsForRoute = mockGroups.filter((g) => g.routeId === route.id);
          const totalTravellers = groupsForRoute.reduce(
            (sum, g) => sum + g.members.length,
            0
          );
          return (
            <Link
              key={route.id}
              href={`/routes/${route.id}`}
              className="block rounded-xl2 border border-line bg-white p-4 transition-all hover:border-transit hover:shadow-lg hover:scale-[1.02] animate-slide-in-right"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">
                    {route.code}
                  </p>
                  <p className="mt-1 font-display text-lg font-bold">
                    {route.source} → {route.destination}
                  </p>
                </div>
                <ChevronRight className="mt-1 h-4 w-4 text-ink/30" />
              </div>

              <div className="mt-3 flex items-center gap-4 text-xs text-ink/50">
                <span className="flex items-center gap-1 tabular">
                  <Clock3 className="h-3.5 w-3.5" />
                  {route.duration}
                </span>
                <span className="tabular">{route.distance}</span>
                <span>{route.stops.length} stops</span>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
                <span className="flex items-center gap-1.5 text-xs font-medium text-transit">
                  <Users className="h-3.5 w-3.5" />
                  {groupsForRoute.length} active group
                  {groupsForRoute.length !== 1 ? "s" : ""} · {totalTravellers}{" "}
                  travelling
                </span>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-medium text-ink/60">
                  Next: {route.stops[0].time}
                </span>
              </div>
            </Link>
          );
        })}
      </section>
    </main>
  );
}
