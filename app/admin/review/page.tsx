"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Save } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface PendingRoute {
  id: string;
  routeId: string;
  routeName: string;
  district: string;
  stops: string[];
  newStopCount: number;
  submittedBy: string;
  createdAt: string;
  timingsText: string;
}

export default function ReviewPage() {
  const [routes, setRoutes] = useState<PendingRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [timingDrafts, setTimingDrafts] = useState<Record<string, string>>({});
  const [rejectOpen, setRejectOpen] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/review/routes", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setRoutes(data.routes);
      setTimingDrafts(
        Object.fromEntries(data.routes.map((r: PendingRoute) => [r.id, r.timingsText]))
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveTimings = async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/review/routes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timingsText: timingDrafts[id] || "" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not save timings");
      toast.success(`Saved ${data.timingsSaved} departure time(s)`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const approve = async (id: string) => {
    setBusyId(id);
    try {
      // Save any edited timings first so they are part of the approved route
      const saveRes = await fetch(`/api/admin/review/routes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timingsText: timingDrafts[id] || "" }),
      });
      if (!saveRes.ok) {
        const d = await saveRes.json();
        throw new Error(d.error || "Fix the timing lines first");
      }

      const res = await fetch(`/api/admin/routes/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      toast.success(
        data.pointsAwarded > 0
          ? `Approved. ${data.pointsAwarded} points awarded.`
          : "Approved."
      );
      setRoutes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    if (rejectReason.trim().length < 5) {
      toast.error("Write a reason of at least 5 characters");
      return;
    }
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/routes/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");

      toast.success("Route rejected. The contributor will see your reason.");
      setRoutes((prev) => prev.filter((r) => r.id !== id));
      setRejectOpen(null);
      setRejectReason("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <PageWrapper
      currentPage="admin"
      title="Review Submissions"
      description="Approve or reject routes submitted by contributors"
      gradient={true}
    >
      <div className="mx-auto max-w-4xl px-4 space-y-6">
        {loading && <p className="text-gray-500">Loading submissions…</p>}

        {!loading && routes.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
            No pending submissions.
          </div>
        )}

        {routes.map((route) => {
          const busy = busyId === route.id;
          return (
            <article key={route.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <header className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">{route.routeName}</h2>
                <p className="text-sm text-gray-500">
                  {route.district} · {route.stops.length} stops
                  {route.newStopCount > 0 && ` (${route.newStopCount} new)`} · ID {route.routeId}
                </p>
              </header>

              <div className="mb-4">
                <p className="mb-1 text-sm font-semibold text-gray-700">Stops in order</p>
                <ol className="list-decimal space-y-0.5 pl-5 text-sm text-gray-600">
                  {route.stops.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ol>
              </div>

              <div className="mb-4">
                <label htmlFor={`t-${route.id}`} className="mb-1 block text-sm font-semibold text-gray-700">
                  Departure times from the first stop
                </label>
                <textarea
                  id={`t-${route.id}`}
                  value={timingDrafts[route.id] ?? ""}
                  onChange={(e) =>
                    setTimingDrafts((d) => ({ ...d, [route.id]: e.target.value }))
                  }
                  rows={4}
                  placeholder={`07:15 weekday\n08:30 daily\n09:00 sunday`}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => saveTimings(route.id)}
                  disabled={busy}
                  className="mt-2 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:underline disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> Save timings
                </button>
              </div>

              {rejectOpen === route.id ? (
                <div className="space-y-3 rounded-lg bg-red-50 p-4">
                  <label htmlFor={`r-${route.id}`} className="block text-sm font-semibold text-red-800">
                    Reason for rejection (shown to the contributor)
                  </label>
                  <textarea
                    id={`r-${route.id}`}
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-red-200 px-3 py-2 text-sm focus:outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => reject(route.id)}
                      disabled={busy}
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                    >
                      Confirm rejection
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRejectOpen(null);
                        setRejectReason("");
                      }}
                      className="rounded-lg px-4 py-2 text-sm text-gray-600 hover:bg-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => approve(route.id)}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => setRejectOpen(route.id)}
                    disabled={busy}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </PageWrapper>
  );
}
