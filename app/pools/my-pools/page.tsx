"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Car, Bike, Clock, Calendar, IndianRupee, Plus } from "lucide-react";

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
  isCreator?: boolean;
}

export default function MyPoolsPage() {
  const [joinedPools, setJoinedPools] = useState<Pool[]>([]);
  const [createdPools, setCreatedPools] = useState<Pool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPools();
  }, []);

  const fetchMyPools = async () => {
    try {
      const response = await fetch("/api/pools/my-pools");
      const data = await response.json();

      if (response.ok) {
        setJoinedPools(data.joinedPools);
        setCreatedPools(data.createdPools);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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

  const PoolCard = ({ pool }: { pool: Pool }) => (
    <Link
      href={`/pools/${pool._id}`}
      className="block rounded-xl2 border border-line bg-white p-6 hover:border-transit transition-all"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transit/10">
              {getVehicleIcon(pool.vehicleType)}
            </div>
            <div>
              <h3 className="font-display font-bold">
                {pool.route.from} → {pool.route.to}
              </h3>
              <p className="text-sm text-ink/60 capitalize">{pool.vehicleType}</p>
            </div>
          </div>

          <div className="ml-13 grid gap-3 md:grid-cols-4 text-sm">
            <div className="flex items-center gap-2 text-ink/60">
              <Clock className="h-4 w-4" />
              <span>{pool.departureTime}</span>
            </div>
            <div className="flex items-center gap-2 text-ink/60">
              <Calendar className="h-4 w-4" />
              <span>{pool.days.slice(0, 2).join(", ")}{pool.days.length > 2 ? "..." : ""}</span>
            </div>
            <div className="flex items-center gap-2 text-ink/60">
              <Users className="h-4 w-4" />
              <span>
                {pool.membersCount}/{pool.totalSeats}
              </span>
            </div>
            <div className="flex items-center gap-2 text-green-600 font-medium">
              <IndianRupee className="h-4 w-4" />
              <span>₹{pool.costPerPerson}</span>
            </div>
          </div>
        </div>

        <div>
          {pool.isCreator && (
            <span className="rounded-full bg-transit/10 px-3 py-1 text-xs font-medium text-transit">
              Creator
            </span>
          )}
          {pool.status === "active" && pool.seatsAvailable > 0 && (
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Active
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
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <p className="text-center text-ink/60">Loading your pools...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/pools"
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to All Pools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                My Pools
              </h1>
              <p className="mt-2 text-ink/60">
                Manage your ride pools
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

        {/* Created Pools */}
        {createdPools.length > 0 && (
          <div className="mb-8 animate-slide-in-up">
            <h2 className="font-display text-xl font-bold mb-4">
              Pools You Created ({createdPools.length})
            </h2>
            <div className="space-y-4">
              {createdPools.map((pool) => (
                <PoolCard key={pool._id} pool={pool} />
              ))}
            </div>
          </div>
        )}

        {/* Joined Pools */}
        {joinedPools.length > 0 && (
          <div className="animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="font-display text-xl font-bold mb-4">
              Pools You Joined ({joinedPools.length})
            </h2>
            <div className="space-y-4">
              {joinedPools.map((pool) => (
                <PoolCard key={pool._id} pool={pool} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {joinedPools.length === 0 && createdPools.length === 0 && (
          <div className="text-center py-12 rounded-xl2 border border-line bg-white animate-slide-in-up">
            <Users className="h-12 w-12 text-ink/20 mx-auto mb-4" />
            <h3 className="font-display text-lg font-bold mb-2">
              No Pools Yet
            </h3>
            <p className="text-ink/60 mb-6">
              Create a pool or join an existing one to get started
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/pools/create"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-travel px-6 py-2 text-sm font-medium text-white hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4" />
                Create Pool
              </Link>
              <Link
                href="/pools"
                className="inline-flex items-center gap-2 rounded-lg border border-line px-6 py-2 text-sm font-medium hover:bg-gray-50 transition-all"
              >
                Browse Pools
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
