"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Plus, Users, Car, Bike, Bus, MapPin, Clock, Calendar, IndianRupee, ArrowRight } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

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
      case "bus":
        return <Bus className="h-5 w-5 text-green-600" />;
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
    <PageWrapper
      currentPage="pools"
      title="Ride Pooling"
      description="Share rides, split costs, and travel together with fellow commuters"
      gradient={true}
    >
      <div className="mx-auto max-w-5xl px-4">
        {/* Header with Create Button */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Ride Pools</h1>
          <Link
            href="/pools/create"
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium text-sm"
          >
            <Plus className="h-4 w-4" />
            Create Pool
          </Link>
        </div>

        {/* Search - Professional Design */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-4 p-4">
              {/* From Input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <input
                  type="text"
                  id="from"
                  value={searchFrom}
                  onChange={(e) => setSearchFrom(e.target.value)}
                  placeholder="Starting point"
                  className="w-full pl-8 pr-4 py-3 text-base border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>

              {/* To Input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <input
                  type="text"
                  id="to"
                  value={searchTo}
                  onChange={(e) => setSearchTo(e.target.value)}
                  placeholder="Destination"
                  className="w-full pl-8 pr-4 py-3 text-base border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg flex items-center gap-2 font-medium"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Loading */}
        {loading && (
          <div className="text-center py-8 text-gray-500 text-sm">
            Loading pools...
          </div>
        )}

        {/* Pools List */}
        {!loading && (
          <div className="space-y-3">
            {pools.length === 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 mx-auto mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">No ride pools available</h3>
                <p className="text-sm text-gray-500 mb-4">Be the first to create a ride pool</p>
                <Link
                  href="/pools/create"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg font-medium text-sm"
                >
                  <Plus className="h-4 w-4" />
                  Create Pool
                </Link>
              </div>
            )}

            {pools.map((pool, index) => (
              <Link
                key={pool._id}
                href={`/pools/${pool._id}`}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-lg transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                      pool.vehicleType === 'bus'
                        ? 'bg-gradient-to-br from-green-100 to-green-200 group-hover:from-green-200 group-hover:to-green-300'
                        : 'bg-gradient-to-br from-blue-100 to-blue-200 group-hover:from-blue-200 group-hover:to-blue-300'
                    }`}>
                      {getVehicleIcon(pool.vehicleType)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 text-base">{pool.route.from}</h3>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <h3 className="font-semibold text-gray-900 text-base">{pool.route.to}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" />
                          {pool.departureTime}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="capitalize">{pool.vehicleType}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {pool.vehicleType === 'bus' ? (
                      <div>
                        <span className="text-green-600 font-bold text-lg">Free</span>
                        <p className="text-xs text-green-500 mt-0.5">Networking</p>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-center gap-1 text-blue-600 font-bold text-lg">
                          <IndianRupee className="h-4 w-4" />
                          <span>{pool.costPerPerson}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">per person</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-5 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{pool.seatsAvailable}/{pool.totalSeats} seats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-600">{pool.days.slice(0, 2).join(', ')}{pool.days.length > 2 ? '...' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <div className={`h-2 w-2 rounded-full ${pool.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="text-gray-600 capitalize">{pool.status}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        {!loading && pools.length > 0 && (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Total pools:</span>
                <span className="font-semibold text-gray-900">{pools.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Available seats:</span>
                <span className="font-semibold text-gray-900">{pools.reduce((sum, p) => sum + p.seatsAvailable, 0)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Active pools:</span>
                <span className="font-semibold text-gray-900">{pools.filter(p => p.status === "active").length}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
