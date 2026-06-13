"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Bus, MapPin, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface DirectRoute {
  routeId: string;
  routeName: string;
  boardAt: string;
  dropAt: string;
  stopsInBetween: number;
  journeyStops: string[];
  verified: boolean;
  verifiedBy: number;
}

interface OneChangeRoute {
  route1: { routeId: string; routeName: string };
  route2: { routeId: string; routeName: string };
  boardAt: string;
  changeAt: string;
  dropAt: string;
}

interface SearchResult {
  from: string;
  to: string;
  hasDirectRoute: boolean;
  directRoutes: DirectRoute[];
  oneChangeRoutes: OneChangeRoute[];
  requiresChange: boolean;
}

export default function SearchBusPage() {
  const searchParams = useSearchParams();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load from URL params and auto-search
  useEffect(() => {
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    
    if (fromParam) setFrom(fromParam);
    if (toParam) setTo(toParam);
    
    // Auto-search if both params present
    if (fromParam && toParam) {
      performSearch(fromParam, toParam);
    }
  }, [searchParams]);

  const performSearch = async (fromLoc: string, toLoc: string) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `/api/search?from=${encodeURIComponent(fromLoc)}&to=${encodeURIComponent(toLoc)}`
      );
      
      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Search failed");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!from || !to) {
      setError("Please enter both from and to locations");
      return;
    }

    performSearch(from, to);
  };

  const handleSwap = () => {
    const temp = from;
    setFrom(to);
    setTo(temp);
  };

  return (
    <PageWrapper 
      currentPage="search"
      title="Find Your Bus"
      description="Search for direct buses or one-change routes across Kerala"
      gradient={true}
    >
      <div className="mx-auto max-w-4xl px-4">{/* Content wrapper */}

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <div className="space-y-6">
              {/* From */}
              <div>
                <label htmlFor="from" className="block text-sm font-medium mb-2">
                  From
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-ink/40" />
                  <input
                    type="text"
                    id="from"
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Mullassery"
                    className="w-full rounded-lg border border-line pl-11 pr-4 py-3 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="rounded-full border border-line bg-white p-2 hover:bg-gray-50 transition-all"
                >
                  <RefreshCw className="h-5 w-5 text-ink/60" />
                </button>
              </div>

              {/* To */}
              <div>
                <label htmlFor="to" className="block text-sm font-medium mb-2">
                  To
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-signal" />
                  <input
                    type="text"
                    id="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Sakthan Stand"
                    className="w-full rounded-lg border border-line pl-11 pr-4 py-3 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                  />
                </div>
              </div>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-lg bg-gradient-travel px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  Search Buses
                </>
              )}
            </button>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-lg border border-red-200 bg-red-50 p-4 animate-slide-in-up">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-slide-in-up">
            {/* Direct Routes */}
            {result.hasDirectRoute && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h2 className="font-display text-xl font-bold">
                    Direct Bus Found
                  </h2>
                </div>

                <div className="space-y-4">
                  {result.directRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="rounded-xl2 border border-line bg-white p-6 hover:border-transit transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Bus className="h-5 w-5 text-transit" />
                            <h3 className="font-display font-bold">
                              {route.routeId}
                            </h3>
                          </div>
                          <p className="text-sm text-ink/60">{route.routeName}</p>
                        </div>
                        {route.verified && (
                          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                            ✓ Verified by {route.verifiedBy}
                          </span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-transit/10">
                            <MapPin className="h-4 w-4 text-transit" />
                          </div>
                          <div>
                            <p className="text-xs text-ink/40">Board at</p>
                            <p className="font-medium">{route.boardAt}</p>
                          </div>
                        </div>

                        <div className="ml-4 border-l-2 border-dashed border-line pl-4 py-2">
                          <p className="text-sm text-ink/60">
                            {route.stopsInBetween} {route.stopsInBetween === 1 ? "stop" : "stops"} in between
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-signal/10">
                            <MapPin className="h-4 w-4 text-signal" />
                          </div>
                          <div>
                            <p className="text-xs text-ink/40">Drop at</p>
                            <p className="font-medium">{route.dropAt}</p>
                          </div>
                        </div>
                      </div>

                      {/* Journey Stops */}
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-transit hover:underline">
                          View all stops
                        </summary>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {route.journeyStops.map((stop, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-gray-100 px-3 py-1 text-xs"
                            >
                              {stop}
                            </span>
                          ))}
                        </div>
                      </details>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* One-Change Routes */}
            {result.requiresChange && (
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-600" />
                  <h2 className="font-display text-xl font-bold">
                    1 Change Required
                  </h2>
                </div>

                <div className="space-y-4">
                  {result.oneChangeRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="rounded-xl2 border border-line bg-white p-6"
                    >
                      {/* Bus 1 */}
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Bus className="h-5 w-5 text-transit" />
                          <h3 className="font-display font-bold">
                            Bus 1: {route.route1.routeId}
                          </h3>
                        </div>
                        <p className="text-sm text-ink/60 mb-3">{route.route1.routeName}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <p className="text-ink/40">Board</p>
                            <p className="font-medium">{route.boardAt}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-ink/40" />
                          <div>
                            <p className="text-ink/40">Drop</p>
                            <p className="font-medium">{route.changeAt}</p>
                          </div>
                        </div>
                      </div>

                      {/* Change Point */}
                      <div className="my-4 rounded-lg bg-orange-50 border border-orange-200 p-3">
                        <p className="text-sm font-medium text-orange-800">
                          Change at: {route.changeAt}
                        </p>
                      </div>

                      {/* Bus 2 */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Bus className="h-5 w-5 text-transit" />
                          <h3 className="font-display font-bold">
                            Bus 2: {route.route2.routeId}
                          </h3>
                        </div>
                        <p className="text-sm text-ink/60 mb-3">{route.route2.routeName}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <p className="text-ink/40">Board</p>
                            <p className="font-medium">{route.changeAt}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-ink/40" />
                          <div>
                            <p className="text-ink/40">Drop</p>
                            <p className="font-medium">{route.dropAt}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Routes Found */}
            {!result.hasDirectRoute && !result.requiresChange && (
              <div className="rounded-xl2 border border-line bg-white p-8 text-center">
                <Bus className="h-12 w-12 text-ink/20 mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold mb-2">
                  No Routes Found
                </h3>
                <p className="text-ink/60">
                  We couldn&apos;t find any buses from {result.from} to {result.to}.
                </p>
                <p className="text-sm text-ink/40 mt-2">
                  Try searching for nearby stops or help us add this route!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
