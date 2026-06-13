"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle } from "lucide-react";

interface RouteData {
  routeId: string;
  routeName: string;
  stops: string[];
}

export default function SuggestStopPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [route, setRoute] = useState<RouteData | null>(null);
  const [formData, setFormData] = useState({
    stopName: "",
    beforeStop: "",
    afterStop: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchRoute();
  }, [id]);

  const fetchRoute = async () => {
    try {
      const response = await fetch(`/api/routes/${id}`);
      const data = await response.json();

      if (response.ok) {
        setRoute(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "missing_stop",
          routeId: id,
          stopName: formData.stopName,
          district: "Thrissur", // Default for now
          taluk: "", // Will be filled by admin
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Thank you! Your suggestion has been submitted for review.",
        });
        setFormData({ stopName: "", beforeStop: "", afterStop: "" });

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push(`/routes/${id}`);
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-center text-ink/60">Loading...</p>
        </div>
      </main>
    );
  }

  if (!route) {
    return (
      <main className="min-h-screen bg-paper">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <p className="text-center text-ink/60">Route not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href={`/routes/${id}`}
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Route
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Suggest Missing Stop
          </h1>
          <p className="mt-2 text-ink/60">
            Help improve route {route.routeId} ({route.routeName})
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up">
          <div className="rounded-xl2 border border-line bg-white p-6">
            {/* Stop Name */}
            <div className="mb-6">
              <label htmlFor="stopName" className="block text-sm font-medium mb-2">
                Missing Stop Name <span className="text-signal">*</span>
              </label>
              <input
                type="text"
                id="stopName"
                value={formData.stopName}
                onChange={(e) => setFormData({ ...formData, stopName: e.target.value })}
                placeholder="Kurishupally"
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                required
              />
              <p className="mt-1 text-xs text-ink/40">
                Enter the name of the stop that&apos;s missing from this route
              </p>
            </div>

            {/* Position Info */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Where should this stop be added? (Optional)
              </label>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="beforeStop" className="block text-xs text-ink/60 mb-1">
                    Before stop
                  </label>
                  <select
                    id="beforeStop"
                    value={formData.beforeStop}
                    onChange={(e) => setFormData({ ...formData, beforeStop: e.target.value })}
                    className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                  >
                    <option value="">Select stop</option>
                    {route.stops.map((stop, index) => (
                      <option key={index} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="afterStop" className="block text-xs text-ink/60 mb-1">
                    After stop
                  </label>
                  <select
                    id="afterStop"
                    value={formData.afterStop}
                    onChange={(e) => setFormData({ ...formData, afterStop: e.target.value })}
                    className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                  >
                    <option value="">Select stop</option>
                    {route.stops.map((stop, index) => (
                      <option key={index} value={stop}>
                        {stop}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <p className="mt-2 text-xs text-ink/40">
                Help us understand where this stop should be positioned
              </p>
            </div>

            {/* Current Route Stops */}
            <div className="rounded-lg bg-paper border border-line p-4">
              <p className="text-sm font-medium mb-3">Current stops on this route:</p>
              <div className="flex flex-wrap gap-2">
                {route.stops.map((stop, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-white border border-line px-3 py-1 text-xs"
                  >
                    {index + 1}. {stop}
                  </span>
                ))}
              </div>
            </div>

            {/* Info Box */}
            <div className="mt-6 rounded-lg bg-transit/5 border border-transit/20 p-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-transit flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-transit mb-1">
                    How it works:
                  </p>
                  <ul className="space-y-1 text-ink/60">
                    <li>• Your suggestion will be reviewed by admins</li>
                    <li>• Other users can approve your suggestion</li>
                    <li>• 5+ approvals = Auto-approved</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-lg border p-4 animate-slide-in-up ${
                message.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {message.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <p
                  className={`text-sm font-medium ${
                    message.type === "success" ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gradient-travel px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit Suggestion"}
          </button>
        </form>
      </div>
    </main>
  );
}
