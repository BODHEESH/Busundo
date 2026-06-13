"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bus, MapPin, CheckCircle2, AlertCircle, Plus, ArrowLeft } from "lucide-react";

interface RouteData {
  _id: string;
  routeId: string;
  routeName: string;
  district: string;
  stops: string[];
  verified: boolean;
  verifiedBy: number;
  createdAt: string;
}

export default function RouteDetailPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [route, setRoute] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verifyMessage, setVerifyMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const fetchRoute = async () => {
    try {
      const response = await fetch(`/api/routes/${id}`);
      const data = await response.json();

      if (response.ok) {
        setRoute(data);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setVerifyMessage(null);

    try {
      const response = await fetch(`/api/routes/${id}/verify`, {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setVerifyMessage("Route verified successfully!");
        // Refresh route data
        fetchRoute();
      } else {
        setVerifyMessage(data.error);
      }
    } catch (err: any) {
      setVerifyMessage(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <p className="text-center text-ink/60">Loading route...</p>
        </div>
      </main>
    );
  }

  if (error || !route) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error || "Route not found"}</p>
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
            href="/search-bus"
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Link>
          
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10">
                  <Bus className="h-6 w-6 text-transit" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold">
                    {route.routeId}
                  </h1>
                  <p className="text-ink/60">{route.routeName}</p>
                </div>
              </div>
              
              <div className="ml-15 flex items-center gap-4 text-sm">
                <span className="text-ink/40">District:</span>
                <span className="font-medium">{route.district}</span>
                <span className="text-ink/40">•</span>
                <span className="font-medium">{route.stops.length} stops</span>
              </div>
            </div>

            {/* Verification Status */}
            <div>
              {route.verified ? (
                <div className="rounded-full bg-green-100 px-4 py-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">
                    Verified by {route.verifiedBy}
                  </span>
                </div>
              ) : (
                <div className="rounded-full bg-orange-100 px-4 py-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-700">
                    Community Submitted
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Verify Message */}
        {verifyMessage && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 animate-slide-in-up">
            <p className="text-sm text-green-800">{verifyMessage}</p>
          </div>
        )}

        {/* Stops List */}
        <div className="mb-8 rounded-xl2 border border-line bg-white p-6 animate-slide-in-up">
          <h2 className="font-display text-lg font-bold mb-4">Route Stops</h2>
          
          <div className="space-y-3">
            {route.stops.map((stop, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-transit/10 text-sm font-medium text-transit">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{stop}</p>
                </div>
                {index === 0 && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Start
                  </span>
                )}
                {index === route.stops.length - 1 && (
                  <span className="rounded-full bg-signal/10 px-3 py-1 text-xs font-medium text-signal">
                    End
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid gap-4 md:grid-cols-2 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="rounded-lg border border-line bg-white px-6 py-4 hover:border-green-500 hover:bg-green-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <p className="font-medium">
                  {verifying ? "Verifying..." : "Verify This Route"}
                </p>
                <p className="text-xs text-ink/60">
                  Help confirm this route is accurate
                </p>
              </div>
            </div>
          </button>

          {/* Missing Stop Button */}
          <Link
            href={`/routes/${id}/suggest`}
            className="rounded-lg border border-line bg-white px-6 py-4 hover:border-transit hover:bg-transit/5 transition-all"
          >
            <div className="flex items-center gap-3">
              <Plus className="h-5 w-5 text-transit" />
              <div className="text-left">
                <p className="font-medium">Missing Stop?</p>
                <p className="text-xs text-ink/60">
                  Suggest a stop that&apos;s missing
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </main>
  );
}
