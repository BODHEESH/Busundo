"use client";

import Link from "next/link";
import { Bus, MapPin, List, Users } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

export default function ContributePage() {
  return (
    <PageWrapper
      currentPage="contribute"
      title="Contribute to BusUndo"
      description="Help build the community by adding routes and stops"
      gradient={true}
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Hero Section */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-2xl shadow-blue-500/40 mb-6">
            <Users className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Contributions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            BusUndo is powered by people like you. Add routes, stops, and help make public transport better for everyone.
          </p>
        </div>

        {/* Contribution Options */}
        <div className="grid gap-6 md:grid-cols-2 mb-12 animate-slide-in-up">
          {/* Add Route */}
          <Link
            href="/contribute/routes/add"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:border-blue-500 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md group-hover:shadow-lg transition-shadow">
                <Bus className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  Add a Route
                </h3>
                <p className="text-gray-600">
                  Know a bus route that's missing? Add it to help others find their way.
                </p>
              </div>
            </div>
            <div className="ml-18 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                <span>Quick 30-second submission</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                <span>Admin will verify before going live</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                <span>Help thousands of commuters</span>
              </div>
            </div>
          </Link>

          {/* Add Stop */}
          <Link
            href="/contribute/stops/add"
            className="group block rounded-2xl border border-gray-200 bg-white p-8 shadow-lg hover:shadow-2xl transition-all hover:border-green-500 hover:scale-[1.02]"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md group-hover:shadow-lg transition-shadow">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                  Add a Stop
                </h3>
                <p className="text-gray-600">
                  Add a bus stop that's not in our database yet.
                </p>
              </div>
            </div>
            <div className="ml-18 space-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span>Simple form to fill</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span>Verified by admin team</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                <span>Build the community database</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Browse Data */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Browse Existing Data
          </h2>
          <div className="grid gap-6 md:grid-cols-2 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {/* View Routes */}
            <Link
              href="/contribute/routes"
              className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl transition-all hover:border-blue-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <List className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    View All Routes
                  </h3>
                  <p className="text-sm text-gray-600">
                    Browse all verified bus routes
                  </p>
                </div>
              </div>
            </Link>

            {/* View Stops */}
            <Link
              href="/contribute/stops"
              className="group block rounded-2xl border border-gray-200 bg-white p-6 shadow-md hover:shadow-xl transition-all hover:border-green-500"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 group-hover:bg-green-100 transition-colors">
                  <List className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                    View All Stops
                  </h3>
                  <p className="text-sm text-gray-600">
                    Browse all verified bus stops
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-8 shadow-lg animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500 flex-shrink-0">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-blue-900 mb-3">
                How Community Contributions Work
              </h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <span>You submit a route or stop with all the details</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <span>Our admin team reviews and verifies the information</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <span>Once approved, it goes live and helps everyone in the community</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <span>You get credit for helping build the platform!</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
