"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2, Plus, ShieldCheck } from "lucide-react";

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
  const [processingId, setProcessingId] = useState<string | null>(null);

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

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch(`/api/admin/stops/${id}/approve`, { method: "POST" });
      if (res.ok) {
        fetchStops();
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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20">
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
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  All Bus Stops
                </h1>
                <p className="mt-1 text-gray-600">
                  Manage all bus stops in the database
                </p>
              </div>
            </div>
            <Link
              href="/admin/stops/add"
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:scale-105 transition-all"
            >
              <Plus className="h-5 w-5" />
              Add Stop
            </Link>
          </div>
        </div>

        {/* Stats & Filter */}
        <div className="mb-10 grid gap-6 md:grid-cols-2 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Stops</p>
                <p className="mt-2 text-5xl font-bold text-gray-900">{stops.length}</p>
                <p className="mt-2 text-sm text-gray-500">Bus stops across all taluks</p>
              </div>
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
                <MapPin className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Pending count */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
                <p className="mt-2 text-5xl font-bold text-orange-600">
                  {stops.filter(s => !s.verified).length}
                </p>
                <p className="mt-2 text-sm text-gray-500">Stops awaiting approval</p>
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
            <p className="text-gray-500">Loading stops...</p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="h-1 w-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  {taluk} ({talukStops.length} stops)
                </h2>
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {talukStops.map((stop, index) => (
                    <div
                      key={stop._id}
                      className="group rounded-2xl border border-gray-200 bg-white p-5 hover:border-green-500 hover:shadow-xl transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${0.1 + index * 0.02}s` }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md group-hover:shadow-lg transition-shadow">
                          <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 truncate group-hover:text-green-600 transition-colors">
                            {stop.stopName}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {stop.district}
                          </p>
                          {stop.verified && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                              <span>Verified by {stop.verifiedBy}</span>
                            </div>
                          )}
                          {!stop.verified && (
                            <div className="mt-2 flex items-center gap-2">
                              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-xs font-medium text-orange-700">
                                Pending
                              </span>
                              <button
                                onClick={() => handleApprove(stop._id)}
                                disabled={processingId === stop._id}
                                className="flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 hover:bg-green-200 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                {processingId === stop._id ? "..." : "Approve"}
                              </button>
                            </div>
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
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No stops found</p>
                <Link
                  href="/admin/stops/add"
                  className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
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
