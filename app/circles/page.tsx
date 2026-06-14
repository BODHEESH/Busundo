"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Plus, Car, MapPin, ArrowRight, Calendar, IndianRupee, Clock, Shield, UserPlus, AlertCircle } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface Circle {
  _id: string;
  name: string;
  type: 'office' | 'college' | 'apartment' | 'other';
  membersCount: number;
  activeRides: number;
  totalSaved: number;
  members: string[];
  inviteOnly: boolean;
}

interface CommuteMatch {
  _id: string;
  circleName: string;
  memberName: string;
  from: string;
  to: string;
  time: string;
  availableSeats: number;
  costPerPerson: number;
}

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [commuteMatches, setCommuteMatches] = useState<CommuteMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCommuteMatch, setShowCommuteMatch] = useState(false);

  useEffect(() => {
    fetchCircles();
    fetchCommuteMatches();
  }, []);

  const fetchCircles = async () => {
    try {
      // Mock data - replace with actual API
      const mockCircles: Circle[] = [
        {
          _id: '1',
          name: 'Infopark Employees',
          type: 'office',
          membersCount: 24,
          activeRides: 8,
          totalSaved: 12500,
          members: ['Biju', 'Arjun', 'Nikhil', 'Sreehari'],
          inviteOnly: true,
        },
        {
          _id: '2',
          name: 'Thrissur Engineering Students',
          type: 'college',
          membersCount: 15,
          activeRides: 5,
          totalSaved: 8200,
          members: ['Priya', 'Ravi', 'Anjali'],
          inviteOnly: true,
        },
      ];
      setCircles(mockCircles);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchCommuteMatches = async () => {
    const mockMatches: CommuteMatch[] = [
      {
        _id: 'm1',
        circleName: 'Infopark Employees',
        memberName: 'Biju',
        from: 'Mullassery',
        to: 'Infopark',
        time: '9:00 AM',
        availableSeats: 2,
        costPerPerson: 50,
      },
    ];
    setCommuteMatches(mockMatches);
  };

  const getCircleIcon = (type: string) => {
    switch (type) {
      case 'office': return '💼';
      case 'college': return '🎓';
      case 'apartment': return '🏢';
      default: return '👥';
    }
  };

  return (
    <PageWrapper
      currentPage="circles"
      title="Travel Circles"
      description="Trust-based carpooling with people you know"
      gradient={true}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-2xl shadow-purple-500/40 mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted Travel Network
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Carpool with people you trust. Save money, reduce traffic, travel together.
          </p>
          
          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button
              onClick={() => setShowCommuteMatch(!showCommuteMatch)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Car className="h-5 w-5" />
              Find Commute Match
            </button>
            <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2 animate-pulse">
              <AlertCircle className="h-5 w-5" />
              Emergency Ride
            </button>
            <Link
              href="/circles/create"
              className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-bold hover:border-purple-500 hover:bg-purple-50 transition-all hover:scale-105 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Create Circle
            </Link>
          </div>
        </div>

        {/* Daily Commute Match Section */}
        {showCommuteMatch && (
          <div className="mb-10 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 shadow-xl animate-slide-in-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                <Car className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Daily Commute Match</h2>
                <p className="text-sm text-gray-600">Find circle members traveling your route</p>
              </div>
            </div>
            
            {/* Commute Form */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">From</label>
                <input
                  type="text"
                  placeholder="Mullassery"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">To</label>
                <input
                  type="text"
                  placeholder="Infopark"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  defaultValue="09:00"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Matches */}
            {commuteMatches.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-green-700 mb-3">
                  ✓ {commuteMatches.length} circle member(s) traveling same route
                </p>
                {commuteMatches.map((match) => (
                  <div key={match._id} className="rounded-xl bg-white border border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold text-lg">
                          {match.memberName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{match.memberName}</p>
                          <p className="text-sm text-gray-600">{match.circleName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {match.from} → {match.to}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {match.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-green-600 font-semibold">{match.availableSeats} seats</span>
                          <span className="text-blue-600 font-semibold">₹{match.costPerPerson}/person</span>
                        </div>
                      </div>
                      <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold hover:shadow-lg transition-all">
                        Join Ride
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="relative inline-flex">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl mx-auto mb-8 animate-bounce">
                <Users className="h-10 w-10" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-white text-xl font-bold">Discovering Travel Circles...</p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-400"></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-600"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <Shield className="h-7 w-7 text-purple-600" />
              Your Trusted Circles
            </h2>
            
            {circles.map((circle, index) => (
              <div
                key={circle._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Circle Header */}
                <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{getCircleIcon(circle.type)}</div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{circle.name}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold">{circle.membersCount}</span> members
                          </div>
                          <div className="flex items-center gap-1">
                            <Car className="h-4 w-4" />
                            <span className="font-semibold">{circle.activeRides}</span> active rides
                          </div>
                          <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4 text-green-600" />
                            <span className="text-green-600 font-semibold">Invite Only</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href={`/circles/${circle._id}`}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-purple-700 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                    >
                      View Circle
                    </Link>
                  </div>
                </div>

                {/* Circle Content */}
                <div className="p-6">
                  {/* Members */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Members</p>
                    <div className="flex items-center gap-2">
                      {circle.members.map((member, idx) => (
                        <div
                          key={idx}
                          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white font-bold shadow-md"
                          title={member}
                        >
                          {member[0]}
                        </div>
                      ))}
                      <button className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-purple-500 hover:text-purple-500 transition-all">
                        <UserPlus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Expense Split Calculator */}
                  <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                        <IndianRupee className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Monthly Expense Split</p>
                        <p className="text-xs text-gray-600">Auto-calculated fuel costs</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Total Fuel</p>
                        <p className="text-2xl font-bold text-gray-900">₹{circle.totalSaved}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Members</p>
                        <p className="text-2xl font-bold text-gray-900">{circle.membersCount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">Per Person</p>
                        <p className="text-2xl font-bold text-green-600">₹{Math.round(circle.totalSaved / circle.membersCount)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <p className="text-xs text-green-700 text-center">
                        💰 Each member saves ~₹{Math.round((circle.totalSaved / circle.membersCount) * 0.5)} compared to solo travel
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
