"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Flame,
  Leaf,
  Car,
  TrendingUp,
  Users,
  Award,
  Target,
  Calendar,
  Share2,
  Crown,
  Zap,
  Heart,
  MapPin,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

export default function MyBusundoPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'wrapped'>('overview');

  // Mock user stats
  const userStats = {
    name: "Bodheesh VC",
    commuteScore: 82,
    ecoScore: 85,
    sharedRides: 15,
    fuelSaved: 3250,
    co2Saved: 48,
    currentStreak: 7,
    longestStreak: 23,
    totalTrips: 142,
    routesExplored: 12,
    contributionPoints: 450,
    travelKarma: 892,
    rank: "Route Expert",
    badges: [
      { id: 1, name: "Route Expert", icon: "🎯", earned: true },
      { id: 2, name: "Community Leader", icon: "👑", earned: true },
      { id: 3, name: "Eco Warrior", icon: "🌱", earned: true },
      { id: 4, name: "Travel Guru", icon: "✨", earned: false },
      { id: 5, name: "Top Contributor", icon: "⭐", earned: true },
      { id: 6, name: "100 Day Streak", icon: "🔥", earned: false },
    ],
    topRoute: "Thrissur → Chavakkad",
    topCommunity: "Thrissur-Chavakkad",
  };

  return (
    <PageWrapper
      currentPage="profile"
      title="My Busundo"
      description="Your travel journey, stats, and achievements"
      gradient
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Profile Card */}
        <div className="mb-10 rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30 text-white font-bold text-3xl shadow-xl">
                {userStats.name[0]}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">{userStats.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold flex items-center gap-1">
                    <Crown className="h-4 w-4" />
                    {userStats.rank}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-semibold flex items-center gap-1">
                    <Zap className="h-4 w-4" />
                    {userStats.travelKarma} Karma
                  </span>
                </div>
              </div>
            </div>
            <button className="px-6 py-3 rounded-xl bg-white text-purple-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Share Profile
            </button>
          </div>

          {/* Commute Score */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-300" />
                <p className="text-sm font-semibold text-white/80">Commute Score</p>
              </div>
              <p className="text-4xl font-bold text-white">{userStats.commuteScore}</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Leaf className="h-5 w-5 text-green-300" />
                <p className="text-sm font-semibold text-white/80">Eco Score</p>
              </div>
              <p className="text-4xl font-bold text-white">{userStats.ecoScore}</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Flame className="h-5 w-5 text-orange-300" />
                <p className="text-sm font-semibold text-white/80">Streak</p>
              </div>
              <p className="text-4xl font-bold text-white">{userStats.currentStreak}</p>
            </div>
            <div className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Car className="h-5 w-5 text-blue-300" />
                <p className="text-sm font-semibold text-white/80">Shared Rides</p>
              </div>
              <p className="text-4xl font-bold text-white">{userStats.sharedRides}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-4 px-4 font-bold transition-all ${
              activeTab === 'overview'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-4 px-4 font-bold transition-all ${
              activeTab === 'achievements'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Achievements
          </button>
          <button
            onClick={() => setActiveTab('wrapped')}
            className={`pb-4 px-4 font-bold transition-all ${
              activeTab === 'wrapped'
                ? 'border-b-4 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Travel Wrapped
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-slide-in-up">
            {/* Impact Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Leaf className="h-7 w-7 text-green-600" />
                Your Environmental Impact
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-2">Fuel Saved</p>
                  <p className="text-4xl font-bold text-green-900 mb-1">₹{userStats.fuelSaved.toLocaleString()}</p>
                  <p className="text-xs text-green-600">vs solo travel</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-2">CO₂ Saved</p>
                  <p className="text-4xl font-bold text-blue-900 mb-1">{userStats.co2Saved}kg</p>
                  <p className="text-xs text-blue-600">carbon offset</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-2">Shared Rides</p>
                  <p className="text-4xl font-bold text-purple-900 mb-1">{userStats.sharedRides}</p>
                  <p className="text-xs text-purple-600">carpools joined</p>
                </div>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-100 to-blue-100 border border-green-200">
                <p className="text-center text-sm text-gray-700">
                  🌍 <strong>Amazing!</strong> You've saved enough CO₂ to plant <strong>2 trees</strong> worth of carbon offset
                </p>
              </div>
            </div>

            {/* Streak Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Flame className="h-7 w-7 text-orange-600" />
                Daily Commute Streak
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-6xl font-bold text-orange-600 mb-2">{userStats.currentStreak} 🔥</p>
                  <p className="text-lg text-gray-600">Current Streak</p>
                  <p className="text-sm text-gray-500 mt-1">Longest: {userStats.longestStreak} days</p>
                </div>
                <div className="text-right">
                  <div className="mb-4">
                    <p className="text-sm text-gray-500 mb-2">Next Milestone</p>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-48 rounded-full bg-gray-200">
                        <div className="h-3 rounded-full bg-gradient-to-r from-orange-500 to-red-500" style={{ width: `${(userStats.currentStreak / 15) * 100}%` }}></div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">15 days</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Keep reporting to maintain your streak!</p>
                </div>
              </div>
            </div>

            {/* Top Routes & Communities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-blue-600" />
                  Top Route
                </h3>
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <p className="text-2xl font-bold text-blue-900 mb-1">{userStats.topRoute}</p>
                  <p className="text-sm text-blue-600">{userStats.totalTrips} trips</p>
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  Top Community
                </h3>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                  <p className="text-2xl font-bold text-purple-900 mb-1">{userStats.topCommunity}</p>
                  <p className="text-sm text-purple-600">{userStats.contributionPoints} contributions</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6 animate-slide-in-up">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Award className="h-7 w-7 text-yellow-600" />
                Your Badges
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {userStats.badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`p-6 rounded-xl border-2 text-center transition-all ${
                      badge.earned
                        ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300 shadow-md'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                    }`}
                  >
                    <div className="text-5xl mb-3">{badge.icon}</div>
                    <p className={`font-bold ${badge.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                      {badge.name}
                    </p>
                    {!badge.earned && (
                      <p className="text-xs text-gray-400 mt-1">Locked</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Travel Wrapped Tab */}
        {activeTab === 'wrapped' && (
          <div className="space-y-6 animate-slide-in-up">
            <div className="rounded-2xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600 p-8 shadow-2xl text-white">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-2">Your Busundo Journey 2026</h2>
                <p className="text-white/80">Your year in travel</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-6xl font-bold mb-2">{userStats.totalTrips}</p>
                  <p className="text-white/80">Total Trips</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-6xl font-bold mb-2">4,512</p>
                  <p className="text-white/80">Kilometers</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-6xl font-bold mb-2">₹12.3k</p>
                  <p className="text-white/80">Money Saved</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-6xl font-bold mb-2">{userStats.routesExplored}</p>
                  <p className="text-white/80">Routes Explored</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-6xl font-bold mb-2">{userStats.sharedRides}</p>
                  <p className="text-white/80">Carpools</p>
                </div>
                <div className="text-center p-6 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                  <p className="text-6xl font-bold mb-2">{userStats.co2Saved}kg</p>
                  <p className="text-white/80">CO₂ Saved</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button className="px-8 py-4 rounded-xl bg-white text-purple-600 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto">
                  <Share2 className="h-5 w-5" />
                  Share on Instagram
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
