"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, MessageSquare, TrendingUp, MapPin } from "lucide-react";

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
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight">
                Communities
              </h1>
              <p className="mt-2 text-ink/60">
                Join route communities and stay updated
              </p>
            </div>
            <Link
              href="/communities/create"
              className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg transition-all"
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 animate-slide-in-up">
            {communities.length === 0 && (
              <div className="col-span-full text-center py-12 rounded-xl2 border border-line bg-white">
                <Users className="h-12 w-12 text-ink/20 mx-auto mb-4" />
                <p className="text-ink/60 mb-4">No communities yet</p>
                <Link
                  href="/communities/create"
                  className="inline-flex items-center gap-2 text-sm text-transit hover:underline"
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
                className="block rounded-xl2 border border-line bg-white p-6 hover:border-transit transition-all"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10 flex-shrink-0">
                    <Users className="h-6 w-6 text-transit" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-lg truncate">
                      {community.name}
                    </h3>
                    {community.route && (
                      <p className="text-sm text-ink/60 flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {community.route.from} ↔ {community.route.to}
                      </p>
                    )}
                  </div>
                </div>

                <p className="text-sm text-ink/60 mb-4 line-clamp-2">
                  {community.description}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-ink/60">
                    <Users className="h-4 w-4" />
                    <span>{community.membersCount} members</span>
                  </div>
                  <span className="text-xs text-ink/40">
                    {new Date(community.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        {!loading && communities.length > 0 && (
          <div className="mt-8 rounded-xl2 border border-line bg-white p-6 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-display font-bold mb-4">Community Stats</h3>
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
    </main>
  );
}
