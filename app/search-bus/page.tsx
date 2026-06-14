"use client";

import { useState, useEffect, Suspense } from "react";
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

function SearchBusContent() {
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
      <div className="mx-auto max-w-5xl px-4">
        {/* Search Form - Google Maps Style */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="flex items-center gap-3 p-4">
              {/* From Input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                </div>
                <input
                  type="text"
                  id="from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  placeholder="Starting point"
                  className="w-full pl-8 pr-4 py-3 text-base border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>

              {/* Swap Button */}
              <button
                type="button"
                onClick={handleSwap}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <RefreshCw className="h-5 w-5 text-gray-500" />
              </button>

              {/* To Input */}
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <div className="h-2 w-2 rounded-full bg-red-500"></div>
                </div>
                <input
                  type="text"
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="Destination"
                  className="w-full pl-8 pr-4 py-3 text-base border-0 focus:outline-none focus:ring-0 placeholder-gray-400"
                />
              </div>

              {/* Search Button */}
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
              >
                {loading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </form>

        {/* Error */}
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Direct Routes */}
            {result.hasDirectRoute && (
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-medium">Direct routes available</span>
                </div>

                <div className="space-y-3">
                  {result.directRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                            <Bus className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{route.routeId}</h3>
                            <p className="text-sm text-gray-500">{route.routeName}</p>
                          </div>
                        </div>
                        {route.verified && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            ✓ Verified
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                          <span className="text-gray-600">{route.boardAt}</span>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-red-500"></div>
                          <span className="text-gray-600">{route.dropAt}</span>
                        </div>
                        <span className="text-gray-400 text-xs ml-auto">
                          {route.stopsInBetween} {route.stopsInBetween === 1 ? 'stop' : 'stops'}
                        </span>
                      </div>

                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer hover:underline">
                          View stops
                        </summary>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {route.journeyStops.map((stop, i) => (
                            <span
                              key={i}
                              className="text-xs bg-gray-100 px-2 py-1 rounded"
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
                <div className="mb-3 flex items-center gap-2 text-sm text-orange-700 bg-orange-50 px-3 py-2 rounded-lg">
                  <RefreshCw className="h-4 w-4" />
                  <span className="font-medium">1 transfer required</span>
                </div>

                <div className="space-y-3">
                  {result.oneChangeRoutes.map((route, index) => (
                    <div
                      key={index}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-400 hover:shadow-md transition-all"
                    >
                      {/* Bus 1 */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Bus className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{route.route1.routeId}</span>
                            <span className="text-xs text-gray-500">{route.route1.routeName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <span>{route.boardAt}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{route.changeAt}</span>
                          </div>
                        </div>
                      </div>

                      {/* Change Point */}
                      <div className="flex items-center gap-2 my-2 px-2">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <span className="text-xs text-orange-600 font-medium">Change at {route.changeAt}</span>
                        <div className="h-px flex-1 bg-gray-200"></div>
                      </div>

                      {/* Bus 2 */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                          <Bus className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">{route.route2.routeId}</span>
                            <span className="text-xs text-gray-500">{route.route2.routeName}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                            <span>{route.changeAt}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span>{route.dropAt}</span>
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
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <Bus className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">No routes found</h3>
                <p className="text-sm text-gray-500">
                  No buses available from {result.from} to {result.to}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}

export default function SearchBusPage() {
  return (
    <Suspense fallback={
      <PageWrapper
        currentPage="search"
        title="Find Your Bus"
        description="Search for direct buses or one-change routes across Kerala"
        gradient={true}
      >
        <div className="mx-auto max-w-4xl px-4">
          <div className="text-center py-12">
            <p className="text-white">Loading...</p>
          </div>
        </div>
      </PageWrapper>
    }>
      <SearchBusContent />
    </Suspense>
  );
}
