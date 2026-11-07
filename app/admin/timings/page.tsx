"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Save, Search } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface LiveRoute {
  id: string;
  routeId: string;
  routeName: string;
  district: string;
  originStop: string;
  timingsText: string;
  timingsUpdatedAt: string | null;
}

export default function LiveTimingsPage() {
  const [routes, setRoutes] = useState<LiveRoute[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/timings/routes", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load routes");
      setRoutes(data.routes);
      setDrafts(Object.fromEntries(data.routes.map((r: LiveRoute) => [r.id, r.timingsText])));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return routes;
    return routes.filter(
      (r) =>
        r.routeName.toLowerCase().includes(q) ||
        r.routeId.toLowerCase().includes(q) ||
        r.originStop.toLowerCase().includes(q)
    );
  }, [routes, query]);

  const save = async (route: LiveRoute) => {
    setBusyId(route.id);
    try {
      const res = await fetch(`/api/admin/timings/routes/${route.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timingsText: drafts[route.id] || "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save");
      toast.success(`Saved ${data.timingsSaved} time(s) for ${route.routeId}`);
      setRoutes((prev) =>
        prev.map((r) =>
          r.id === route.id
            ? { ...r, timingsText: drafts[route.id] || "", timingsUpdatedAt: new Date().toISOString() }
            : r
        )
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageWrapper
      currentPage="admin"
      title="Live Route Timings"
      description="Correct departure times on routes that are already live"
      gradient={true}
    >
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by route name, ID, or first stop"
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-4 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        {loading && <p className="text-gray-500">Loading routes…</p>}
        {!loading && visible.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No live routes match.
          </div>
        )}

        {visible.map((route) => (
          <article key={route.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <header className="mb-3">
              <h2 className="font-semibold text-gray-900">{route.routeName}</h2>
              <p className="text-xs text-gray-500">
                {route.routeId} · {route.district} · from {route.originStop || "unknown"}
                {route.timingsUpdatedAt &&
                  ` · last changed ${new Date(route.timingsUpdatedAt).toLocaleDateString("en-IN")}`}
              </p>
            </header>
            <textarea
              aria-label={`Departure times for ${route.routeName}`}
              value={drafts[route.id] ?? ""}
              onChange={(e) => setDrafts((d) => ({ ...d, [route.id]: e.target.value }))}
              rows={3}
              placeholder={"07:15 weekday\n08:30 daily\n09:00 sunday"}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => save(route)}
                disabled={busyId === route.id || (drafts[route.id] ?? "") === route.timingsText}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-40"
              >
                <Save className="h-4 w-4" /> Save timings
              </button>
            </div>
          </article>
        ))}
      </div>
    </PageWrapper>
  );
}
