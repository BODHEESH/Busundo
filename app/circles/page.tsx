"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Lock, Unlock, MapPin } from "lucide-react";

interface Circle {
  _id: string;
  name: string;
  description: string;
  route?: { from: string; to: string };
  membersCount: number;
  isPrivate: boolean;
  createdAt: string;
}

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCircles();
  }, []);

  const fetchCircles = async () => {
    try {
      const response = await fetch("/api/circles");
      const data = await response.json();
      if (response.ok) setCircles(data.circles);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold">Travel Circles</h1>
            <p className="mt-2 text-ink/60">Join circles with similar travel patterns</p>
          </div>
          <div className="flex gap-2">
            <Link href="/circles/my-circles" className="rounded-lg border border-line px-4 py-2 text-sm font-medium hover:bg-gray-50">
              My Circles
            </Link>
            <Link href="/circles/create" className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg">
              <Plus className="h-4 w-4" />
              Create Circle
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-ink/60">Loading circles...</p></div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {circles.map((circle) => (
              <Link key={circle._id} href={`/circles/${circle._id}`} className="block rounded-xl2 border border-line bg-white p-6 hover:border-transit transition-all">
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10">
                    {circle.isPrivate ? <Lock className="h-6 w-6 text-transit" /> : <Unlock className="h-6 w-6 text-transit" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display font-bold">{circle.name}</h3>
                    {circle.route && <p className="text-xs text-ink/60 flex items-center gap-1 mt-1"><MapPin className="h-3 w-3" />{circle.route.from} → {circle.route.to}</p>}
                  </div>
                </div>
                <p className="text-sm text-ink/60 mb-4 line-clamp-2">{circle.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-ink/60"><Users className="h-4 w-4" />{circle.membersCount} members</span>
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${circle.isPrivate ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    {circle.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>
              </Link>
            ))}
            {circles.length === 0 && (
              <div className="col-span-full text-center py-12 rounded-xl2 border border-line bg-white">
                <Users className="h-12 w-12 text-ink/20 mx-auto mb-4" />
                <p className="text-ink/60 mb-4">No circles yet</p>
                <Link href="/circles/create" className="inline-flex items-center gap-2 text-sm text-transit hover:underline"><Plus className="h-4 w-4" />Create the first circle</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
