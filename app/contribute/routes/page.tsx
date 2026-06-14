"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bus, CheckCircle2, Plus } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface Route {
  _id: string;
  routeId: string;
  routeName: string;
  district: string;
  stopsCount: number;
  verified: boolean;
  verifiedBy: number;
}

export default function UserViewRoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("/api/routes?verified=true");
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
    <PageWrapper
      currentPage="contribute"
      title="All Routes"
      description="Browse all verified bus routes"
      gradient={true}
    >
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link
            href="/contribute"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contribute
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
                  Browse all verified bus routes
                </p>
              </div>
            </div>
            <Link
              href="/contribute/routes/add"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="h-5 w-5" />
              Add Route
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg animate-slide-in-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Routes</p>
              <p className="mt-2 text-5xl font-bold text-gray-900">{routes.length}</p>
              <p className="mt-2 text-sm text-gray-500">Verified and active bus routes</p>
            </div>
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
              <Bus className="h-10 w-10 text-white" />
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
                className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300"
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
                      <div className="flex items-center gap-1.5 text-green-600 font-medium">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="text-xs">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {routes.length === 0 && (
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No routes found</p>
                <Link
                  href="/contribute/routes/add"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                >
                  <Plus className="h-4 w-4" />
                  Add the first route
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
