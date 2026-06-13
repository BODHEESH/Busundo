"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Car, Bike, Users, Clock, Calendar, MapPin, IndianRupee, CheckCircle2, AlertCircle, UserPlus, UserMinus } from "lucide-react";

interface PoolData {
  _id: string;
  createdBy: string;
  route: { from: string; to: string };
  departureTime: string;
  days: string[];
  seatsAvailable: number;
  totalSeats: number;
  costPerPerson: number;
  vehicleType: string;
  description?: string;
  members: Array<{ userId: string; joinedAt: string }>;
  membersCount: number;
  status: string;
  createdAt: string;
}

export default function PoolDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [pool, setPool] = useState<PoolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchPool();
  }, [id]);

  const fetchPool = async () => {
    try {
      const response = await fetch(`/api/pools/${id}`);
      const data = await response.json();

      if (response.ok) {
        setPool(data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/pools/${id}/join`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Successfully joined the pool!" });
        fetchPool(); // Refresh pool data
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this pool?")) return;

    setActionLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/pools/${id}/leave`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Successfully left the pool" });
        fetchPool(); // Refresh pool data
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (err: any) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setActionLoading(false);
    }
  };

  const getVehicleIcon = (type: string) => {
    switch (type) {
      case "bike":
        return <Bike className="h-6 w-6" />;
      case "car":
      case "auto":
      case "van":
      default:
        return <Car className="h-6 w-6" />;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-center text-ink/60">Loading pool...</p>
        </div>
      </main>
    );
  }

  if (error || !pool) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error || "Pool not found"}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/pools"
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10">
                  {getVehicleIcon(pool.vehicleType)}
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    {pool.route.from} → {pool.route.to}
                  </h1>
                  <p className="text-ink/60 capitalize">{pool.vehicleType} Pool</p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div>
              {pool.status === "active" && pool.seatsAvailable > 0 && (
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  {pool.seatsAvailable} {pool.seatsAvailable === 1 ? "seat" : "seats"} available
                </span>
              )}
              {pool.status === "full" && (
                <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-medium text-orange-700">
                  Pool Full
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-lg border p-4 animate-slide-in-up ${
              message.type === "success"
                ? "border-green-200 bg-green-50"
                : "border-red-200 bg-red-50"
            }`}
          >
            <div className="flex items-center gap-3">
              {message.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <p
                className={`text-sm font-medium ${
                  message.type === "success" ? "text-green-800" : "text-red-800"
                }`}
              >
                {message.text}
              </p>
            </div>
          </div>
        )}

        {/* Pool Details */}
        <div className="mb-8 rounded-xl2 border border-line bg-white p-6 animate-slide-in-up">
          <h2 className="font-display text-lg font-bold mb-4">Pool Details</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-transit" />
              <div>
                <p className="text-xs text-ink/40">Departure Time</p>
                <p className="font-medium">{pool.departureTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-transit" />
              <div>
                <p className="text-xs text-ink/40">Days</p>
                <p className="font-medium">{pool.days.join(", ")}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-transit" />
              <div>
                <p className="text-xs text-ink/40">Members</p>
                <p className="font-medium">
                  {pool.membersCount}/{pool.totalSeats} joined
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <IndianRupee className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-xs text-ink/40">Cost Per Person</p>
                <p className="font-medium text-green-600">₹{pool.costPerPerson}</p>
              </div>
            </div>
          </div>

          {pool.description && (
            <div className="mt-4 pt-4 border-t border-line">
              <p className="text-sm text-ink/60">{pool.description}</p>
            </div>
          )}
        </div>

        {/* Members */}
        <div className="mb-8 rounded-xl2 border border-line bg-white p-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="font-display text-lg font-bold mb-4">
            Members ({pool.membersCount})
          </h2>

          <div className="space-y-3">
            {pool.members.map((member, index) => (
              <div
                key={member.userId}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-transit/10 font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">
                      {index === 0 ? "Pool Creator" : `Member ${index + 1}`}
                    </p>
                    <p className="text-xs text-ink/40">
                      Joined {new Date(member.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <span className="rounded-full bg-transit/10 px-3 py-1 text-xs font-medium text-transit">
                    Creator
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-4 md:grid-cols-2 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={handleJoin}
            disabled={actionLoading || pool.status === "full"}
            className="rounded-lg bg-gradient-travel px-6 py-4 font-medium text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <UserPlus className="h-5 w-5" />
            {actionLoading ? "Joining..." : "Join Pool"}
          </button>

          <button
            onClick={handleLeave}
            disabled={actionLoading}
            className="rounded-lg border border-line bg-white px-6 py-4 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <UserMinus className="h-5 w-5" />
            {actionLoading ? "Leaving..." : "Leave Pool"}
          </button>
        </div>

        {/* Benefits */}
        <div className="mt-8 rounded-xl2 border border-line bg-gradient-to-br from-green-50 to-blue-50 p-6 animate-slide-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-display font-bold mb-4">Benefits of Pooling</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Save Money</p>
                <p className="text-sm text-ink/60">Split fuel costs with others</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Reduce Traffic</p>
                <p className="text-sm text-ink/60">Fewer vehicles on road</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Eco-Friendly</p>
                <p className="text-sm text-ink/60">Lower carbon emissions</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Make Friends</p>
                <p className="text-sm text-ink/60">Connect with commuters</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
