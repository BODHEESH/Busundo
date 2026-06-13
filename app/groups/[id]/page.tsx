import { notFound } from "next/navigation";
import { Users, Clock3, Share2, MessageCircle, Send, Facebook, Instagram, Link2, Bus } from "lucide-react";
import { TopNav } from "@/components/nav";
import { RouteLine } from "@/components/route-line";
import { StatusBadge } from "@/components/status-badge";
import { STATUS_META, STATUS_ORDER } from "@/lib/status";
import { mockGroups, mockRoutes } from "@/lib/mock-data";

export default function GroupDetailPage({ params }: { params: { id: string } }) {
  const group = mockGroups.find((g) => g.id === params.id);
  if (!group) notFound();
  const route = mockRoutes.find((r) => r.id === group.routeId)!;
  const you = group.members.find((m) => m.isYou);
  const shareUrl = `busundo.app/g/${group.id}`;

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <TopNav back={{ href: `/dashboard`, label: "Dashboard" }} />

      <section className="py-5 animate-fade-in">
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
      </section>

      {/* Live progress */}
      <section className="rounded-xl2 border border-transit/30 bg-white p-5 shadow-md animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-sm font-bold flex items-center gap-2">
            <Bus className="h-4 w-4 text-transit animate-bus-drive" />
            Live journey
          </h2>
          <span className="flex items-center gap-1.5 text-xs font-medium text-transit">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-2 w-2 animate-ping rounded-full bg-transit opacity-50" />
              <span className="h-2 w-2 rounded-full bg-transit" />
            </span>
            Updating in real time
          </span>
        </div>
        <RouteLine stops={route.stops} currentIndex={group.currentStopIndex} />
      </section>

      {/* Your status */}
      {you && (
        <section className="mt-6 rounded-xl2 border border-line bg-white p-5 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="mb-3 font-display text-sm font-bold">Your status</h2>
          <div className="flex flex-wrap gap-2">
            {STATUS_ORDER.map((status) => {
              const meta = STATUS_META[status];
              const active = status === you.status;
              return (
                <button
                  key={status}
                  className={
                    active
                      ? "rounded-full bg-transit px-3 py-2 text-xs font-semibold text-paper"
                      : "rounded-full border border-line px-3 py-2 text-xs font-medium text-ink/60 hover:border-transit hover:text-ink"
                  }
                >
                  {meta.label}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-ink/40">
            Your group sees this update instantly.
          </p>
        </section>
      )}

      {/* Members */}
      <section className="mt-6">
        <h2 className="mb-3 font-display text-base font-bold">
          Members ({group.members.length})
        </h2>
        <div className="space-y-2">
          {group.members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between rounded-xl2 border border-line bg-white p-3"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-transit font-display text-sm font-bold text-paper">
                  {member.initial}
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {member.name}
                    {member.isYou && (
                      <span className="ml-1.5 text-xs font-normal text-ink/40">
                        (you)
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <StatusBadge status={member.status} />
            </div>
          ))}

          {Array.from({ length: group.capacity - group.members.length }).map(
            (_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 rounded-xl2 border border-dashed border-line p-3 text-sm text-ink/30"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-dashed border-line text-xs">
                  +
                </span>
                Open spot
              </div>
            )
          )}
        </div>
      </section>

      {/* Share */}
      <section className="mt-8 rounded-xl2 border border-line bg-white p-5 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
        <h2 className="mb-1 font-display text-sm font-bold flex items-center gap-2">
          <Share2 className="h-4 w-4 text-transit" />
          Share this group
        </h2>
        <p className="mb-4 text-xs text-ink/50">
          Anyone with this link can see the group and join if there's space.
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2.5">
          <Link2 className="h-4 w-4 shrink-0 text-ink/40" />
          <span className="flex-1 truncate font-mono text-xs text-ink/70">
            {shareUrl}
          </span>
          <button className="rounded-md bg-transit px-2.5 py-1 text-xs font-semibold text-paper">
            Copy
          </button>
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          <button className="flex flex-col items-center gap-1.5 rounded-lg border border-line py-3 text-xs font-medium text-ink/60 hover:border-transit hover:text-ink">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </button>
          <button className="flex flex-col items-center gap-1.5 rounded-lg border border-line py-3 text-xs font-medium text-ink/60 hover:border-transit hover:text-ink">
            <Send className="h-4 w-4" />
            Telegram
          </button>
          <button className="flex flex-col items-center gap-1.5 rounded-lg border border-line py-3 text-xs font-medium text-ink/60 hover:border-transit hover:text-ink">
            <Facebook className="h-4 w-4" />
            Facebook
          </button>
          <button className="flex flex-col items-center gap-1.5 rounded-lg border border-line py-3 text-xs font-medium text-ink/60 hover:border-transit hover:text-ink">
            <Instagram className="h-4 w-4" />
            Instagram
          </button>
        </div>
      </section>
    </main>
  );
}
