import Link from "next/link";
import { Clock3, Users, MapPin, Info } from "lucide-react";
import { TopNav } from "@/components/nav";
import { mockRoutes } from "@/lib/mock-data";

export default function CreateGroupPage() {
  const route = mockRoutes[0];

  return (
    <main className="mx-auto max-w-3xl px-4 pb-16">
      <TopNav back={{ href: `/routes/${route.id}`, label: "Route" }} />

      <section className="py-5">
        <h1 className="font-display text-2xl font-bold tracking-tight">
          Start a travel group
        </h1>
        <p className="mt-1 text-sm text-ink/50">
          Others on this route can find and join you.
        </p>
      </section>

      {/* Selected route */}
      <section className="flex items-center gap-3 rounded-xl2 border border-line bg-white p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper">
          <MapPin className="h-4 w-4 text-transit" />
        </span>
        <div>
          <p className="font-display text-sm font-semibold">
            {route.source} → {route.destination}
          </p>
          <p className="text-xs text-ink/50 tabular">
            {route.code} · {route.duration} · {route.stops.length} stops
          </p>
        </div>
      </section>

      <form className="mt-5 space-y-5 rounded-xl2 border border-line bg-white p-5">
        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Departure time
          </label>
          <div className="relative">
            <Clock3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="time"
              defaultValue="08:30"
              className="w-full rounded-lg border border-line bg-paper py-3 pl-9 pr-3 text-sm outline-none focus:border-transit"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Starting from
          </label>
          <select className="w-full rounded-lg border border-line bg-paper py-3 px-3 text-sm outline-none focus:border-transit">
            {route.stops.map((stop) => (
              <option key={stop.id}>{stop.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Group size
          </label>
          <div className="relative">
            <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="number"
              defaultValue={6}
              min={2}
              max={20}
              className="w-full rounded-lg border border-line bg-paper py-3 pl-9 pr-3 text-sm outline-none focus:border-transit"
            />
          </div>
          <p className="mt-1.5 text-xs text-ink/40">
            Maximum number of people who can join, including you.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Who can join
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-transit bg-transit/5 py-3 text-sm font-medium text-transit-dark">
              <input type="radio" name="visibility" defaultChecked className="accent-transit" />
              Open to all
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-line py-3 text-sm font-medium text-ink/70">
              <input type="radio" name="visibility" className="accent-transit" />
              Rajagiri SOET only
            </label>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-semibold">
            Note for the group <span className="text-ink/40">(optional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="e.g. Waiting near the metro entrance, look for a green backpack"
            className="w-full rounded-lg border border-line bg-paper p-3 text-sm outline-none focus:border-transit"
          />
        </div>

        <div className="flex items-start gap-2 rounded-lg bg-paper p-3 text-xs text-ink/50">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Group chat opens once your journey starts and closes automatically
          when everyone marks the trip as completed.
        </div>

        <Link
          href="/groups/g1"
          className="block w-full rounded-lg bg-transit py-3 text-center text-sm font-semibold text-paper transition hover:bg-transit-dark"
        >
          Create group
        </Link>
      </form>
    </main>
  );
}
