import { notFound } from "next/navigation";
import Link from "next/link";
import { Users, Clock3, MapPin, ArrowRight } from "lucide-react";
import { RouteLine } from "@/components/route-line";
import { StatusBadge } from "@/components/status-badge";
import { mockGroups, mockRoutes } from "@/lib/mock-data";

export default async function PublicGroupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const group = mockGroups.find((g) => g.id === id);
  if (!group) notFound();
  const route = mockRoutes.find((r) => r.id === group.routeId)!;

  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-transit">
              <span className="h-2 w-2 rounded-full bg-signal" />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Busundo
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-lg bg-transit px-4 py-2 text-sm font-semibold text-paper transition hover:bg-transit-dark"
          >
            Sign in
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-xl2 border border-line bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wide text-ink/40">
                {route.code} · {group.college}
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold tracking-tight">
                {route.source} → {route.destination}
              </h1>
              <div className="mt-3 flex items-center gap-4 text-sm text-ink/60">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4" /> Departs {group.departureTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {group.members.length}/{group.capacity} joined
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6 rounded-lg border border-line bg-paper p-4">
            <h2 className="mb-3 font-display text-sm font-bold">Route stops</h2>
            <RouteLine stops={route.stops} currentIndex={group.currentStopIndex} />
          </div>

          <div className="mb-6">
            <h2 className="mb-3 font-display text-sm font-bold">
              Members ({group.members.length})
            </h2>
            <div className="space-y-2">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between rounded-lg border border-line bg-paper p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-transit font-display text-sm font-bold text-paper">
                      {member.initial}
                    </span>
                    <p className="text-sm font-semibold">{member.name}</p>
                  </div>
                  <StatusBadge status={member.status} />
                </div>
              ))}

              {Array.from({ length: group.capacity - group.members.length }).map(
                (_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-3 rounded-lg border border-dashed border-line p-3 text-sm text-ink/30"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-line text-xs">
                      +
                    </span>
                    Open spot
                  </div>
                )
              )}
            </div>
          </div>

          <div className="rounded-lg bg-transit/5 border border-transit/20 p-4 text-center">
            <p className="text-sm font-medium text-ink/70 mb-3">
              Want to join this group?
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-transit px-6 py-3 text-sm font-semibold text-paper transition hover:bg-transit-dark"
            >
              Sign in to join
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-ink/40">
          Shared from Busundo · Travel together, every day
        </p>
      </div>
    </main>
  );
}
