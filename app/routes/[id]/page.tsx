import Link from "next/link";
import { notFound } from "next/navigation";
import { Clock3, Users, Plus, ChevronRight, MapPin } from "lucide-react";
import { TopNav } from "@/components/nav";
import { RouteLine } from "@/components/route-line";
import { mockRoutes, mockGroups } from "@/lib/mock-data";

export default async function RouteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const route = mockRoutes.find((r) => r.id === id);
  if (!route) notFound();

  const groups = mockGroups.filter((g) => g.routeId === route.id);

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <TopNav back={{ href: "/search", label: "Results" }} />

      <section className="py-5">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">
          {route.code}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
          {route.source} → {route.destination}
        </h1>
        <div className="mt-3 flex items-center gap-4 text-sm text-ink/60">
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-4 w-4" /> {route.duration}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" /> {route.distance}
          </span>
          <span>{route.stops.length} stops</span>
        </div>
      </section>

      <section className="rounded-xl2 border border-line bg-white p-5">
        <h2 className="mb-4 font-display text-sm font-bold">Stops on this route</h2>
        <RouteLine stops={route.stops} />
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-base font-bold">Travel groups</h2>
          <Link
            href="/groups/create"
            className="flex items-center gap-1.5 rounded-full bg-transit px-3 py-1.5 text-xs font-semibold text-paper transition hover:bg-transit-dark"
          >
            <Plus className="h-3.5 w-3.5" />
            New group
          </Link>
        </div>

        <div className="space-y-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              href={`/groups/${group.id}`}
              className="flex items-center justify-between rounded-xl2 border border-line bg-white p-4 transition hover:border-transit"
            >
              <div>
                <p className="font-display text-sm font-semibold">
                  Departs {group.departureTime}
                </p>
                <div className="mt-1 flex items-center gap-3 text-xs text-ink/50">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {group.members.length}/{group.capacity} joined
                  </span>
                  <span className="rounded-full bg-paper px-2 py-0.5">
                    {group.college}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-transit px-3 py-1.5 text-xs font-semibold text-paper">
                  Join
                </span>
                <ChevronRight className="h-4 w-4 text-ink/30" />
              </div>
            </Link>
          ))}

          {groups.length === 0 && (
            <div className="rounded-xl2 border border-dashed border-line p-6 text-center text-sm text-ink/50">
              No groups yet on this route. Be the first to start one.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
