"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2, Plus } from "lucide-react";

interface Stop {
  _id: string;
  stopName: string;
  district: string;
  taluk: string;
  verified: boolean;
  verifiedBy: number;
}

export default function ViewStopsPage() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterTaluk, setFilterTaluk] = useState<string>("all");

  useEffect(() => {
    fetchStops();
  }, []);

  const fetchStops = async () => {
    try {
      const response = await fetch("/api/admin/stops");
      const data = await response.json();

      if (response.ok) {
        setStops(data.stops);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique taluks
  const taluks = Array.from(new Set(stops.map(s => s.taluk))).sort();

  // Filter stops
  const filteredStops = filterTaluk === "all" 
    ? stops 
    : stops.filter(s => s.taluk === filterTaluk);

  // Group by taluk
  const stopsByTaluk = filteredStops.reduce((acc, stop) => {
    if (!acc[stop.taluk]) acc[stop.taluk] = [];
    acc[stop.taluk].push(stop);
    return acc;
  }, {} as Record<string, Stop[]>);

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
                All Bus Stops
              </h1>
              <p className="mt-2 text-ink/60">
                Manage all bus stops in the database
              </p>
            </div>
            <Link
              href="/admin/stops/add"
              className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Stop
            </Link>
          </div>
        </div>

        {/* Stats & Filter */}
        <div className="mb-8 space-y-4 animate-slide-in-up">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink/60">Total Stops</p>
                <p className="mt-1 font-display text-3xl font-bold">{stops.length}</p>
              </div>
              <MapPin className="h-8 w-8 text-signal/20" />
            </div>
          </div>

          {/* Filter */}
          <div className="rounded-xl2 border border-line bg-white p-4">
            <label htmlFor="taluk-filter" className="block text-sm font-medium mb-2">
              Filter by Taluk
            </label>
            <select
              id="taluk-filter"
              value={filterTaluk}
              onChange={(e) => setFilterTaluk(e.target.value)}
              className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
            >
              <option value="all">All Taluks ({stops.length} stops)</option>
              {taluks.map(taluk => {
                const count = stops.filter(s => s.taluk === taluk).length;
                return (
                  <option key={taluk} value={taluk}>
                    {taluk} ({count} stops)
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-ink/60">Loading stops...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Stops List - Grouped by Taluk */}
        {!loading && !error && (
          <div className="space-y-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {Object.entries(stopsByTaluk).map(([taluk, talukStops]) => (
              <div key={taluk}>
                <h2 className="font-display text-xl font-bold mb-4">
                  {taluk} ({talukStops.length} stops)
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {talukStops.map((stop, index) => (
                    <div
                      key={stop._id}
                      className="rounded-xl2 border border-line bg-white p-4 hover:border-signal transition-all"
                      style={{ animationDelay: `${0.1 + index * 0.02}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-signal/10">
                          <MapPin className="h-5 w-5 text-signal" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {stop.stopName}
                          </h3>
                          <p className="text-xs text-ink/40 mt-1">
                            {stop.district}
                          </p>
                          {stop.verified && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Verified by {stop.verifiedBy}</span>
                            </div>
                          )}
                          {!stop.verified && (
                            <span className="inline-block mt-2 rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredStops.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-ink/20 mx-auto mb-4" />
                <p className="text-ink/60">No stops found</p>
                <Link
                  href="/admin/stops/add"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-transit hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Add your first stop
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
