"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus, CheckCircle2, Plus } from "lucide-react";

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

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                All Routes
              </h1>
              <p className="mt-2 text-ink/60">
                Manage all bus routes in the database
              </p>
            </div>
            <Link
              href="/admin/routes/add"
              className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Route
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 rounded-xl2 border border-line bg-white p-6 animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink/60">Total Routes</p>
              <p className="mt-1 font-display text-3xl font-bold">{routes.length}</p>
            </div>
            <Bus className="h-8 w-8 text-transit/20" />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-ink/60">Loading routes...</p>
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
                className="rounded-xl2 border border-line bg-white p-6 hover:border-transit transition-all"
                style={{ animationDelay: `${0.1 + index * 0.05}s` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transit/10">
                        <Bus className="h-5 w-5 text-transit" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold">
                          {route.routeId}
                        </h3>
                        <p className="text-sm text-ink/60">{route.routeName}</p>
                      </div>
                    </div>

                    <div className="ml-13 flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-ink/40">District:</span>{" "}
                        <span className="font-medium">{route.district}</span>
                      </div>
                      <div>
                        <span className="text-ink/40">Stops:</span>{" "}
                        <span className="font-medium">{route.stopsCount}</span>
                      </div>
                      {route.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Verified by {route.verifiedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!route.verified && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        Pending Verification
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {routes.length === 0 && (
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-ink/20 mx-auto mb-4" />
                <p className="text-ink/60">No routes found</p>
                <Link
                  href="/admin/routes/add"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-transit hover:underline"
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
