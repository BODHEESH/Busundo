"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Users, Car, Bike, MapPin, Clock, Calendar, IndianRupee } from "lucide-react";

interface Pool {
  _id: string;
  route: { from: string; to: string };
  departureTime: string;
  days: string[];
  seatsAvailable: number;
  totalSeats: number;
  costPerPerson: number;
  vehicleType: string;
  membersCount: number;
  status: string;
}

export default function PoolsPage() {
  const [pools, setPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async (from?: string, to?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) params.append("from", from);
      if (to) params.append("to", to);

      const response = await fetch(`/api/pools?${params.toString()}`);
      const data = await response.json();

      if (response.ok) {
        setPools(data.pools);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPools(searchFrom, searchTo);
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike":
        return <Bike className="h-5 w-5" />;
      case "car":
      case "auto":
      case "van":
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Ride Pools
              </h1>
              <p className="mt-2 text-ink/60">
                Share rides, split costs, travel together
              </p>
            </div>
            <Link
              href="/pools/create"
              className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg transition-all"
            >
              <Plus className="h-4 w-4" />
              Create Pool
            </Link>
          </div>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8 animate-slide-in-up">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="from" className="block text-sm font-medium mb-2">
                  From
                </label>
                <input
                  type="text"
                  id="from"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  placeholder="Mullassery"
                  className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                />
              </div>
              <div>
                <label htmlFor="to" className="block text-sm font-medium mb-2">
                  To
                </label>
                <input
                  type="text"
                  id="to"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder="Infopark"
                  className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-transit px-6 py-2 font-medium text-white hover:bg-transit-dark transition-all flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search Pools
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-ink/60">Loading pools...</p>
          </div>
        )}

        {/* Pools List */}
        {!loading && (
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {pools.length === 0 && (
              <div className="text-center py-12 rounded-xl2 border border-line bg-white">
                <Users className="h-12 w-12 text-ink/20 mx-auto mb-4" />
                <p className="text-ink/60 mb-4">No pools found</p>
                <Link
                  href="/pools/create"
                  className="inline-flex items-center gap-2 text-sm text-transit hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Create the first pool
                </Link>
              </div>
            )}

            {pools.map((pool) => (
              <Link
                key={pool._id}
                href={`/pools/${pool._id}`}
                className="block rounded-xl2 border border-line bg-white p-6 hover:border-transit transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Route */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transit/10">
                        {getVehicleIcon(pool.vehicleType)}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg">
                          {pool.route.from} → {pool.route.to}
                        </h3>
                        <p className="text-sm text-ink/60 capitalize">
                          {pool.vehicleType}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="ml-13 grid gap-3 md:grid-cols-4 text-sm">
                      <div className="flex items-center gap-2 text-ink/60">
                        <Clock className="h-4 w-4" />
                        <span>{pool.departureTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink/60">
                        <Calendar className="h-4 w-4" />
                        <span>{pool.days.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-ink/60">
                        <Users className="h-4 w-4" />
                        <span>
                          {pool.membersCount}/{pool.totalSeats} members
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-green-600 font-medium">
                        <IndianRupee className="h-4 w-4" />
                        <span>₹{pool.costPerPerson}/person</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    {pool.status === "active" && pool.seatsAvailable > 0 && (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        {pool.seatsAvailable} {pool.seatsAvailable === 1 ? "seat" : "seats"} left
                      </span>
                    )}
                    {pool.status === "full" && (
                      <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700">
                        Full
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {!loading && pools.length > 0 && (
          <div className="mt-8 rounded-xl2 border border-line bg-white p-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-display font-bold mb-4">Pool Statistics</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-ink/60">Total Pools</p>
                <p className="mt-1 font-display text-2xl font-bold">{pools.length}</p>
              </div>
              <div>
                <p className="text-sm text-ink/60">Available Seats</p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {pools.reduce((sum, p) => sum + p.seatsAvailable, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-ink/60">Active Pools</p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {pools.filter(p => p.status === "active").length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
