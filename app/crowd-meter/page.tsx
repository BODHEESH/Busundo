"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bus,
  Users,
  TrendingUp,
  Clock,
  MapPin,
  AlertCircle,
  CheckCircle,
  Share2,
  ThumbsUp,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface BusCrowdData {
  _id: string;
  routeName: string;
  from: string;
  to: string;
  busNumber: string;
  crowdLevel: number; // 0-100
  lastUpdated: string;
  reportsCount: number;
  nextBusIn: number; // minutes
}

export default function CrowdMeterPage() {
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  // Mock data
  const crowdData: BusCrowdData[] = [
    {
      _id: '1',
      routeName: 'Thrissur → Guruvayur',
      from: 'Thrissur',
      to: 'Guruvayur',
      busNumber: 'KL-08-AB-1234',
      crowdLevel: 85,
      lastUpdated: '2 mins ago',
      reportsCount: 12,
      nextBusIn: 15,
    },
    {
      _id: '2',
      routeName: 'Mullassery → Thrissur',
      from: 'Mullassery',
      to: 'Thrissur',
      busNumber: 'KL-08-CD-5678',
      crowdLevel: 35,
      lastUpdated: '5 mins ago',
      reportsCount: 8,
      nextBusIn: 8,
    },
    {
      _id: '3',
      routeName: 'Chavakkad → Thrissur',
      from: 'Chavakkad',
      to: 'Thrissur',
      busNumber: 'KL-08-EF-9012',
      crowdLevel: 60,
      lastUpdated: '1 min ago',
      reportsCount: 15,
      nextBusIn: 20,
    },
  ];

  const getCrowdLabel = (level: number) => {
    if (level < 25) return { label: 'Empty', color: 'green', emoji: '😊' };
    if (level < 50) return { label: 'Moderate', color: 'blue', emoji: '🙂' };
    if (level < 75) return { label: 'Crowded', color: 'orange', emoji: '😐' };
    return { label: 'Packed', color: 'red', emoji: '😰' };
  };

  const getCrowdColor = (level: number) => {
    if (level < 25) return 'from-green-500 to-green-600';
    if (level < 50) return 'from-blue-500 to-blue-600';
    if (level < 75) return 'from-orange-500 to-orange-600';
    return 'from-red-500 to-red-600';
  };

  const reportOptions = [
    { level: 0, label: 'Empty', emoji: '😊', color: 'green' },
    { level: 33, label: 'Moderate', emoji: '🙂', color: 'blue' },
    { level: 66, label: 'Crowded', emoji: '😐', color: 'orange' },
    { level: 100, label: 'Packed', emoji: '😰', color: 'red' },
  ];

  return (
    <PageWrapper
      currentPage="crowd"
      title="Live Crowd Meter"
      description="Real-time bus crowd levels reported by commuters"
      gradient
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 shadow-2xl shadow-red-500/40 mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Live Crowd Meter
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Know before you go. Real-time crowd levels reported by fellow commuters.
          </p>
        </div>

        {/* Quick Report Section */}
        <div className="mb-10 rounded-2xl border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 shadow-xl animate-slide-in-up">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ThumbsUp className="h-6 w-6 text-blue-600" />
            Report Current Bus Crowd
          </h2>
          <p className="text-sm text-gray-600 mb-6">Help others by reporting the crowd level in your current bus</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportOptions.map((option) => (
              <button
                key={option.level}
                onClick={() => setSelectedLevel(option.level)}
                className={`p-6 rounded-xl border-2 transition-all hover:scale-105 ${
                  selectedLevel === option.level
                    ? `border-${option.color}-500 bg-${option.color}-100 shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-5xl mb-2">{option.emoji}</div>
                <p className={`font-bold ${selectedLevel === option.level ? `text-${option.color}-900` : 'text-gray-700'}`}>
                  {option.label}
                </p>
              </button>
            ))}
          </div>

          {selectedLevel !== null && (
            <div className="mt-6 p-4 rounded-xl bg-white border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Select your route</p>
                  <select className="px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>Thrissur → Guruvayur</option>
                    <option>Mullassery → Thrissur</option>
                    <option>Chavakkad → Thrissur</option>
                  </select>
                </div>
                <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105">
                  Submit Report
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Live Crowd Data */}
        <div className="space-y-6 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-orange-600" />
            Live Bus Crowd Levels
          </h2>

          {crowdData.map((bus, index) => {
            const crowdInfo = getCrowdLabel(bus.crowdLevel);
            return (
              <div
                key={bus._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Bus Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100/50 p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 shadow-md">
                        <Bus className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{bus.routeName}</h3>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="font-semibold">{bus.busNumber}</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Updated {bus.lastUpdated}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {bus.reportsCount} reports
                          </div>
                        </div>
                      </div>
                    </div>
                    <button className="px-6 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-bold hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center gap-2">
                      <Share2 className="h-5 w-5" />
                      Share
                    </button>
                  </div>
                </div>

                {/* Crowd Meter */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Crowd Level</p>
                      <div className="flex items-center gap-3">
                        <span className="text-6xl">{crowdInfo.emoji}</span>
                        <div>
                          <p className={`text-3xl font-bold text-${crowdInfo.color}-600`}>{bus.crowdLevel}%</p>
                          <p className={`text-lg font-semibold text-${crowdInfo.color}-700`}>{crowdInfo.label}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Next Bus In</p>
                      <p className="text-4xl font-bold text-gray-900">{bus.nextBusIn}</p>
                      <p className="text-sm text-gray-600">minutes</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative">
                    <div className="h-8 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${getCrowdColor(bus.crowdLevel)} transition-all duration-500 flex items-center justify-end pr-3`}
                        style={{ width: `${bus.crowdLevel}%` }}
                      >
                        <span className="text-white text-sm font-bold">{bus.crowdLevel}%</span>
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Empty</span>
                      <span>Moderate</span>
                      <span>Crowded</span>
                      <span>Packed</span>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className={`mt-6 p-4 rounded-xl border-2 ${
                    bus.crowdLevel > 75 
                      ? 'bg-red-50 border-red-200' 
                      : bus.crowdLevel > 50 
                      ? 'bg-orange-50 border-orange-200'
                      : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {bus.crowdLevel > 75 ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-red-600" />
                          <p className="text-sm text-red-700">
                            <strong>Avoid this bus.</strong> Wait for the next one in {bus.nextBusIn} minutes.
                          </p>
                        </>
                      ) : bus.crowdLevel > 50 ? (
                        <>
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          <p className="text-sm text-orange-700">
                            <strong>Moderately crowded.</strong> You might get a seat.
                          </p>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 text-green-600" />
                          <p className="text-sm text-green-700">
                            <strong>Good time to board!</strong> Plenty of space available.
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* How It Works */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Commuters Report</h3>
              <p className="text-sm text-gray-600">Passengers report crowd levels in real-time</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-orange-600 mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Live Updates</h3>
              <p className="text-sm text-gray-600">Data updates every minute with new reports</p>
            </div>
            <div className="text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Make Better Decisions</h3>
              <p className="text-sm text-gray-600">Know before you go, avoid crowded buses</p>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
