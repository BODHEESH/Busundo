"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, MapPin, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

interface Suggestion {
  _id: string;
  type: string;
  routeId?: string;
  stopName?: string;
  district?: string;
  taluk?: string;
  userId: string;
  status: string;
  approvals: number;
  rejections: number;
  createdAt: string;
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/suggestions");
      const data = await response.json();

      if (response.ok) {
        setSuggestions(data.suggestions);
      } else {
        setError(data.error);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    setProcessingId(id);

    try {
      const response = await fetch(`/api/suggestions/${id}/approve`, {
        method: "POST",
      });

      if (response.ok) {
        // Refresh suggestions
        fetchSuggestions();
      } else {
        const data = await response.json();
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessingId(null);
    }
  };

  const pendingSuggestions = suggestions.filter(s => s.status === "pending");
  const approvedSuggestions = suggestions.filter(s => s.status === "approved");

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50/20">
      <div className="mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/30">
              <MessageSquare className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Community Suggestions
              </h1>
              <p className="mt-1 text-gray-600">
                Review and approve suggestions from users
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-6 md:grid-cols-3 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 shadow-lg bg-white p-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Pending</p>
            <p className="mt-2 text-5xl font-bold text-orange-600">
              {pendingSuggestions.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 shadow-lg bg-white p-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Approved</p>
            <p className="mt-2 text-5xl font-bold text-green-600">
              {approvedSuggestions.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 shadow-lg bg-white p-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total</p>
            <p className="mt-2 text-5xl font-bold text-gray-900">
              {suggestions.length}
            </p>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading suggestions...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Pending Suggestions */}
        {!loading && !error && (
          <div className="space-y-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
            {/* Pending */}
            {pendingSuggestions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-sm font-bold text-white shadow-md">
                    {pendingSuggestions.length}
                  </span>
                  Pending Review
                </h2>

                <div className="space-y-4">
                  {pendingSuggestions.map((suggestion) => (
                    <div
                      key={suggestion._id}
                      className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-orange-500 hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-md group-hover:shadow-lg transition-shadow">
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                                {suggestion.stopName}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {suggestion.type === "missing_stop"
                                  ? `Missing stop on route ${suggestion.routeId}`
                                  : suggestion.type}
                              </p>
                            </div>
                          </div>

                          <div className="ml-13 flex items-center gap-6 text-sm">
                            {suggestion.district && (
                              <div>
                                <span className="text-gray-400">District:</span>{" "}
                                <span className="font-medium text-gray-900">{suggestion.district}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1 text-green-600">
                                <ThumbsUp className="h-4 w-4" />
                                {suggestion.approvals}
                              </span>
                              <span className="flex items-center gap-1 text-red-600">
                                <ThumbsDown className="h-4 w-4" />
                                {suggestion.rejections}
                              </span>
                            </div>
                            <div>
                              <span className="text-xs text-gray-400">
                                {new Date(suggestion.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleApprove(suggestion._id)}
                            disabled={processingId === suggestion._id}
                            className="flex items-center gap-2 rounded-xl bg-green-100 px-5 py-2.5 text-sm font-bold text-green-700 hover:bg-green-200 hover:shadow-md transition-all disabled:opacity-50"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Approve
                          </button>
                          <button
                            disabled={processingId === suggestion._id}
                            className="flex items-center gap-2 rounded-xl bg-red-100 px-5 py-2.5 text-sm font-bold text-red-700 hover:bg-red-200 hover:shadow-md transition-all disabled:opacity-50"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </button>
                        </div>
                      </div>

                      {/* Progress to auto-approval */}
                      {suggestion.approvals > 0 && suggestion.approvals < 5 && (
                        <div className="mt-4 ml-13">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-xs text-gray-500">
                              {suggestion.approvals}/5 approvals for auto-approval
                            </p>
                          </div>
                          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${(suggestion.approvals / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved */}
            {approvedSuggestions.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                  Approved
                </h2>

                <div className="space-y-4">
                  {approvedSuggestions.map((suggestion) => (
                    <div
                      key={suggestion._id}
                      className="rounded-2xl border border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-6 shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                          <MapPin className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-green-900">
                            {suggestion.stopName}
                          </h3>
                          <p className="text-sm text-green-700">
                            Approved and added to database
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {suggestions.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No suggestions yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Suggestions from users will appear here
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
