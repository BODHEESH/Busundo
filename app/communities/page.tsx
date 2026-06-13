"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, MessageSquare, TrendingUp, MapPin } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface Community {
  _id: string;
  name: string;
  description: string;
  route?: { from: string; to: string };
  membersCount: number;
  createdAt: string;
}

export default function CommunitiesPage() {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await fetch("/api/communities");
      const data = await response.json();

      if (response.ok) {
        setCommunities(data.communities);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper
      currentPage="communities"
      title="Communities"
      description="Join route-based communities and stay connected with fellow travelers"
      gradient={true}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link
              href="/communities/create"
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              Create Community
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-ink/60">Loading communities...</p>
          </div>
        )}

        {/* Communities Grid */}
        {!loading && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {communities.length === 0 && (
              <div className="col-span-full text-center py-16 rounded-2xl border border-gray-200 bg-white shadow-lg">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-6 text-lg">No communities yet</p>
                <Link
                  href="/communities/create"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-600 to-orange-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  <Plus className="h-4 w-4" />
                  Create the first community
                </Link>
              </div>
            )}

            {communities.map((community) => (
              <Link
                key={community._id}
                href={`/communities/${community._id}`}
                className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-orange-200"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    <Users className="h-7 w-7" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                      {community.name}
                    </h3>
                    {community.route && (
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-2">
                        <MapPin className="h-4 w-4" />
                        {community.route.from} ↔ {community.route.to}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {community.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Users className="h-4 w-4" />
                    <span className="text-sm font-medium">{community.membersCount} members</span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(community.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && communities.length > 0 && (
          <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Community Stats</h3>
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <p className="text-sm text-ink/60">Total Communities</p>
                <p className="mt-1 font-display text-2xl font-bold">{communities.length}</p>
              </div>
              <div>
                <p className="text-sm text-ink/60">Total Members</p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {communities.reduce((sum, c) => sum + c.membersCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-ink/60">Avg Members/Community</p>
                <p className="mt-1 font-display text-2xl font-bold">
                  {Math.round(communities.reduce((sum, c) => sum + c.membersCount, 0) / communities.length)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
