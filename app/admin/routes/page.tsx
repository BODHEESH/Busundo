"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus, CheckCircle2, Plus, ShieldCheck } from "lucide-react";

interface Route {
  _id: string;
  routeId: string;
  routeName: string;
  district: string;
  stopsCount: number;
  verified: boolean;
  verifiedBy: number;
}

export default function ViewRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("/api/admin/routes");
      const data = await response.json();

      if (response.ok) {
        setRoutes(data.routes);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/routes/${id}/approve`, { method: "POST" });
      if (res.ok) {
        fetchRoutes();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to approve");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Bus className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  All Routes
                </h1>
                <p className="mt-1 text-gray-600">
                  Manage all bus routes in the database
                </p>
              </div>
            </div>
            <Link
              href="/admin/routes/add"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="h-5 w-5" />
              Add Route
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Routes</p>
                <p className="mt-2 text-5xl font-bold text-gray-900">{routes.length}</p>
                <p className="mt-2 text-sm text-gray-500">All bus routes in system</p>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
                <Bus className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="mt-2 text-5xl font-bold text-orange-600">
                  {routes.filter(r => !r.verified).length}
                </p>
                <p className="mt-2 text-sm text-gray-500">Routes awaiting approval</p>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
                <ShieldCheck className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading routes...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Routes List */}
        {!loading && !error && (
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {routes.map((route, index) => (
              <div
                key={route._id}
                className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md group-hover:shadow-lg transition-shadow">
                        <Bus className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {route.routeId}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium">{route.routeName}</p>
                      </div>
                    </div>

                    <div className="ml-16 flex items-center gap-8 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">District:</span>
                        <span className="font-semibold text-gray-900">{route.district}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">Stops:</span>
                        <span className="font-semibold text-gray-900">{route.stopsCount}</span>
                      </div>
                      {route.verified && (
                        <div className="flex items-center gap-1.5 text-green-600 font-medium">
                          <CheckCircle2 className="h-4 w-4" />
                          <span className="text-xs">Verified by {route.verifiedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!route.verified && (
                      <>
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                          Pending Verification
                        </span>
                        <button
                          onClick={() => handleApprove(route._id)}
                          disabled={processingId === route._id}
                          className="flex items-center gap-1.5 rounded-lg bg-green-100 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          {processingId === route._id ? "Approving..." : "Approve"}
                        </button>
                      </>
                    )}
                    {route.verified && (
                      <span className="flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {routes.length === 0 && (
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No routes found</p>
                <Link
                  href="/admin/routes/add"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add your first route
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
