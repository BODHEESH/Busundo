"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  Heart,
  MapPin,
  Clock,
  Calendar,
  MessageCircle,
  UserPlus,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface BuddyMatch {
  _id: string;
  name: string;
  avatar: string;
  matchScore: number;
  commonRoutes: string[];
  commuteSchedule: {
    days: string[];
    time: string;
  };
  interests: string[];
  travelKarma: number;
  verified: boolean;
}

export default function BuddyMatchPage() {
  const [showProfile, setShowProfile] = useState(false);

  // Mock data
  const matches: BuddyMatch[] = [
    {
      _id: '1',
      name: 'Priya M',
      avatar: 'P',
      matchScore: 95,
      commonRoutes: ['Thrissur → Chavakkad', 'Chavakkad → Thrissur'],
      commuteSchedule: {
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        time: '8:30 AM',
      },
      interests: ['Music', 'Books', 'Travel'],
      travelKarma: 1250,
      verified: true,
    },
    {
      _id: '2',
      name: 'Arjun S',
      avatar: 'A',
      matchScore: 88,
      commonRoutes: ['Mullassery → Thrissur'],
      commuteSchedule: {
        days: ['Mon', 'Wed', 'Fri'],
        time: '9:00 AM',
      },
      interests: ['Tech', 'Photography'],
      travelKarma: 890,
      verified: true,
    },
    {
      _id: '3',
      name: 'Ravi Kumar',
      avatar: 'R',
      matchScore: 82,
      commonRoutes: ['Thrissur → Guruvayur'],
      commuteSchedule: {
        days: ['Mon', 'Tue', 'Thu', 'Fri'],
        time: '8:00 AM',
      },
      interests: ['Sports', 'Movies'],
      travelKarma: 650,
      verified: false,
    },
  ];

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500';
    if (score >= 75) return 'from-blue-500 to-blue-600';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <PageWrapper
      currentPage="buddy"
      title="Bus Buddy Match"
      description="Find travel companions on your regular routes"
      gradient
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-2xl shadow-pink-500/40 mb-6">
            <Heart className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bus Buddy Match
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Find travel companions who share your commute. Make friends, share stories, travel together.
          </p>

          <button
            onClick={() => setShowProfile(!showProfile)}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 mx-auto"
          >
            <UserPlus className="h-5 w-5" />
            {showProfile ? 'Hide My Profile' : 'Create Buddy Profile'}
          </button>
        </div>

        {/* Profile Creation */}
        {showProfile && (
          <div className="mb-10 rounded-2xl border-2 border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 p-8 shadow-xl animate-slide-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Buddy Profile</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Regular Routes</label>
                <select multiple className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                  <option>Thrissur → Chavakkad</option>
                  <option>Mullassery → Thrissur</option>
                  <option>Chavakkad → Thrissur</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Commute Days</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                      <button
                        key={day}
                        className="px-4 py-2 rounded-lg border-2 border-gray-300 hover:border-pink-500 hover:bg-pink-50 transition-all"
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Departure Time</label>
                  <input
                    type="time"
                    defaultValue="08:30"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Interests (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., Music, Books, Tech, Sports"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Match Preferences</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Only show verified users</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span className="text-sm text-gray-700">Same gender preference</span>
                  </label>
                </div>
              </div>

              <button className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Save Profile & Find Matches
              </button>
            </div>
          </div>
        )}

        {/* Match Stats */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <Users className="h-12 w-12 text-pink-600 mx-auto mb-3" />
            <p className="text-4xl font-bold text-gray-900 mb-1">{matches.length}</p>
            <p className="text-gray-600">Potential Buddies</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <Heart className="h-12 w-12 text-rose-600 mx-auto mb-3" />
            <p className="text-4xl font-bold text-gray-900 mb-1">12</p>
            <p className="text-gray-600">Connections Made</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <TrendingUp className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <p className="text-4xl font-bold text-gray-900 mb-1">95%</p>
            <p className="text-gray-600">Match Quality</p>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Star className="h-7 w-7 text-yellow-600" />
            Your Best Matches
          </h2>

          {matches.map((match, index) => (
            <div
              key={match._id}
              className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="relative">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-rose-500 text-white font-bold text-2xl shadow-lg">
                        {match.avatar}
                      </div>
                      {match.verified && (
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 border-2 border-white">
                          <Shield className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900">{match.name}</h3>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getMatchColor(match.matchScore)} text-white text-sm font-bold`}>
                          {match.matchScore}% Match
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-500" />
                          <span className="font-semibold">{match.travelKarma}</span> Karma
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {match.commuteSchedule.days.join(', ')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {match.commuteSchedule.time}
                        </div>
                      </div>

                      {/* Common Routes */}
                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Common Routes</p>
                        <div className="flex gap-2 flex-wrap">
                          {match.commonRoutes.map((route, idx) => (
                            <span key={idx} className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {route}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Interests */}
                      {match.interests.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Interests</p>
                          <div className="flex gap-2 flex-wrap">
                            {match.interests.map((interest, idx) => (
                              <span key={idx} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                                {interest}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold hover:shadow-lg transition-all flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      Connect
                    </button>
                    <button className="px-6 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-bold hover:border-pink-500 hover:bg-pink-50 transition-all">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How Bus Buddy Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-pink-100 text-pink-600 mb-4">
                <UserPlus className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-sm text-gray-600">Share your commute schedule and interests</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Get Matched</h3>
              <p className="text-sm text-gray-600">Find buddies with similar routes and schedules</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Travel Together</h3>
              <p className="text-sm text-gray-600">Make friends and enjoy your commute</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
