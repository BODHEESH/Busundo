"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Bus,
  Plus,
  MapPin,
  ArrowRight,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Clock,
  Users,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface RoutePost {
  _id: string;
  type: 'alert' | 'update' | 'question' | 'tip';
  title: string;
  content: string;
  route: string;
  author: string;
  upvotes: number;
  commentsCount: number;
  createdAt: string;
}

interface RouteFeed {
  _id: string;
  routeName: string;
  from: string;
  to: string;
  followersCount: number;
  postsCount: number;
  recentPosts: RoutePost[];
  champion?: {
    name: string;
    avatar: string;
    verifiedUpdates: number;
    badges: string[];
  };
}

export default function CommunitiesPage() {
  const [routeFeeds, setRouteFeeds] = useState<RouteFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'trending' | 'following'>('all');

  useEffect(() => {
    fetchRouteFeeds();
  }, []);

  const fetchRouteFeeds = async (): Promise<void> => {
    try {
      // Mock data for now - replace with actual API
      const mockData: RouteFeed[] = [
        {
          _id: '1',
          routeName: 'Thrissur → Chavakkad',
          from: 'Thrissur',
          to: 'Chavakkad',
          followersCount: 1247,
          postsCount: 89,
          champion: {
            name: 'Bodheesh VC',
            avatar: 'B',
            verifiedUpdates: 142,
            badges: ['🎯 Route Expert', '👑 Community Leader', '⭐ Top Contributor'],
          },
          recentPosts: [
            {
              _id: 'p1',
              type: 'alert',
              title: 'Bus strike tomorrow',
              content: 'KSRTC strike announced. Private buses running.',
              route: 'Thrissur → Chavakkad',
              author: 'Ravi Kumar',
              upvotes: 45,
              commentsCount: 12,
              createdAt: new Date().toISOString(),
            },
          ],
        },
        {
          _id: '2',
          routeName: 'Mullassery → Punnayur',
          from: 'Mullassery',
          to: 'Punnayur',
          followersCount: 856,
          postsCount: 67,
          champion: {
            name: 'Priya M',
            avatar: 'P',
            verifiedUpdates: 89,
            badges: ['✨ Travel Guru', '🌱 Eco Warrior'],
          },
          recentPosts: [
            {
              _id: 'p2',
              type: 'update',
              title: 'New private bus service started',
              content: 'AC bus service every 30 mins from 6 AM',
              route: 'Mullassery → Punnayur',
              author: 'Priya M',
              upvotes: 32,
              commentsCount: 8,
              createdAt: new Date().toISOString(),
            },
          ],
        },
      ];
      setRouteFeeds(mockData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching route feeds:", error);
      setLoading(false);
    }
  };

  const totalFollowers = routeFeeds.reduce((sum, feed) => sum + feed.followersCount, 0);
  const totalPosts = routeFeeds.reduce((sum, feed) => sum + feed.postsCount, 0);

  const getPostIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'update': return <TrendingUp className="h-5 w-5" />;
      case 'question': return <MessageSquare className="h-5 w-5" />;
      default: return <Bus className="h-5 w-5" />;
    }
  };

  const getPostColor = (type: string) => {
    switch (type) {
      case 'alert': return 'from-red-500 to-red-600';
      case 'update': return 'from-green-500 to-green-600';
      case 'question': return 'from-blue-500 to-blue-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <PageWrapper
      currentPage="communities"
      title="Route Intelligence"
      description="Real-time updates, alerts, and discussions for every route"
      gradient
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl shadow-orange-500/40 mb-6">
            <Bus className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Route Intelligence Network
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Reddit for commuters. Get real-time updates, traffic alerts, and local knowledge for every route.
          </p>
          
          {/* Filter Tabs */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              All Routes
            </button>
            <button
              onClick={() => setFilter('trending')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'trending'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              <TrendingUp className="h-4 w-4 inline mr-2" />
              Trending
            </button>
            <button
              onClick={() => setFilter('following')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'following'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Following
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="mb-10 grid gap-6 md:grid-cols-3 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Active Routes</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{routeFeeds.length}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <Bus className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Followers</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{totalFollowers.toLocaleString()}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                <Users className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Posts</p>
                <p className="mt-2 text-4xl font-bold text-gray-900">{totalPosts}</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md">
                <MessageSquare className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Route Feeds */}
        {!loading && (
          <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            {routeFeeds.map((feed, index) => (
              <div
                key={feed._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Route Header */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100/50 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                        <Bus className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">{feed.routeName}</h2>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">{feed.followersCount.toLocaleString()}</span> followers
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-semibold">{feed.postsCount}</span> posts
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105">
                      + Follow Route
                    </button>
                  </div>
                  
                  {/* Route Champion */}
                  {feed.champion && (
                    <div className="rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 text-white font-bold text-xl shadow-lg">
                              {feed.champion.avatar}
                            </div>
                            <div className="absolute -top-1 -right-1 text-2xl">👑</div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-gray-900">Route Champion</p>
                              <span className="px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 text-xs font-bold">TOP</span>
                            </div>
                            <p className="text-sm text-gray-700 font-semibold">{feed.champion.name}</p>
                            <p className="text-xs text-gray-600">{feed.champion.verifiedUpdates} verified updates</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Badges</p>
                          <div className="flex gap-1">
                            {feed.champion.badges.map((badge, idx) => (
                              <span key={idx} className="text-lg" title={badge}>
                                {badge.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recent Posts */}
                <div className="p-6 space-y-4">
                  {feed.recentPosts.map((post) => (
                    <div
                      key={post._id}
                      className="group rounded-xl border border-gray-200 bg-gray-50 p-5 hover:border-blue-500 hover:bg-white transition-all cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${getPostColor(post.type)} shadow-md`}>
                          {getPostIcon(post.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <span className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                              <Clock className="h-3 w-3" />
                              2h ago
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{post.content}</p>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                              <TrendingUp className="h-4 w-4" />
                              <span className="font-semibold">{post.upvotes}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors">
                              <MessageSquare className="h-4 w-4" />
                              <span className="font-semibold">{post.commentsCount}</span> comments
                            </div>
                            <span className="text-gray-400">by {post.author}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <Link
                    href={`/communities/${feed._id}`}
                    className="block text-center py-3 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                  >
                    View all posts in {feed.routeName} →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}