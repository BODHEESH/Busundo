"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Lock, Unlock, MapPin } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

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
    <PageWrapper
      currentPage="circles"
      title="Travel Circles"
      description="Join circles with similar travel patterns and create lasting connections"
      gradient={true}
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <Link href="/circles/my-circles" className="rounded-full border border-gray-300 px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
              My Circles
            </Link>
            <Link href="/circles/create" className="flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <Plus className="h-4 w-4" />
              Create Circle
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12"><p className="text-white">Loading circles...</p></div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {circles.map((circle) => (
              <Link key={circle._id} href={`/circles/${circle._id}`} className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 hover:border-purple-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
                    {circle.isPrivate ? <Lock className="h-7 w-7" /> : <Unlock className="h-7 w-7" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-900 group-hover:text-purple-600 transition-colors">{circle.name}</h3>
                    {circle.route && <p className="text-sm text-gray-500 flex items-center gap-1 mt-2"><MapPin className="h-4 w-4" />{circle.route.from} → {circle.route.to}</p>}
                  </div>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{circle.description}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-gray-500"><Users className="h-4 w-4" /><span className="text-sm font-medium">{circle.membersCount} members</span></span>
                  <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${circle.isPrivate ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                    {circle.isPrivate ? 'Private' : 'Public'}
                  </span>
                </div>
              </Link>
            ))}
            {circles.length === 0 && (
              <div className="col-span-full text-center py-16 rounded-2xl border border-gray-200 bg-white shadow-lg">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-6 text-lg">No circles yet</p>
                <Link href="/circles/create" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <Plus className="h-4 w-4" />
                  Create the First Circle
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
