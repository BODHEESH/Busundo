"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bus, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function AddRoutePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    routeId: "",
    routeName: "",
    district: "Thrissur",
    stops: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        // Reset form
        setFormData({
          routeId: "",
          routeName: "",
          district: "Thrissur",
          stops: "",
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/admin/routes");
        }, 2000);
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const stopCount = formData.stops.split("\n").filter(s => s.trim()).length;

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Add New Route
          </h1>
          <p className="mt-2 text-ink/60">
            Create a new bus route in 30 seconds
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up">
          <div className="rounded-xl2 border border-line bg-white p-6">
            {/* Route ID */}
            <div className="mb-6">
              <label htmlFor="routeId" className="block text-sm font-medium mb-2">
                Route ID <span className="text-signal">*</span>
              </label>
              <input
                type="text"
                id="routeId"
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                placeholder="PB021"
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                required
              />
              <p className="mt-1 text-xs text-ink/40">
                Example: PB021, PB022, etc.
              </p>
            </div>

            {/* Route Name */}
            <div className="mb-6">
              <label htmlFor="routeName" className="block text-sm font-medium mb-2">
                Route Name <span className="text-signal">*</span>
              </label>
              <input
                type="text"
                id="routeName"
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                placeholder="Thrissur-Kodakara"
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                required
              />
              <p className="mt-1 text-xs text-ink/40">
                Example: Thrissur-Kodakara, Mullassery-Punnayur
              </p>
            </div>

            {/* District */}
            <div className="mb-6">
              <label htmlFor="district" className="block text-sm font-medium mb-2">
                District <span className="text-signal">*</span>
              </label>
              <select
                id="district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                required
              >
                <option value="Thrissur">Thrissur</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Palakkad">Palakkad</option>
                <option value="Malappuram">Malappuram</option>
              </select>
            </div>

            {/* Stops */}
            <div className="mb-6">
              <label htmlFor="stops" className="block text-sm font-medium mb-2">
                Stops (one per line) <span className="text-signal">*</span>
              </label>
              <textarea
                id="stops"
                value={formData.stops}
                onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                placeholder={`Sakthan Stand\nOllur\nPudukad\nKodakara`}
                rows={10}
                className="w-full rounded-lg border border-line px-4 py-2 font-mono text-sm focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                required
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-ink/40">
                  Paste stop names, one per line
                </p>
                <p className="text-xs font-medium text-transit">
                  {stopCount} {stopCount === 1 ? "stop" : "stops"}
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-transit/5 border border-transit/20 p-4">
              <div className="flex gap-3">
                <Bus className="h-5 w-5 text-transit flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-transit mb-1">
                    How it works:
                  </p>
                  <ul className="space-y-1 text-ink/60">
                    <li>• Missing stops will be created automatically</li>
                    <li>• Route will be created with all stops in order</li>
                    <li>• Takes only 30 seconds!</li>
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
            disabled={loading || stopCount === 0}
            className="w-full rounded-lg bg-gradient-travel px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Route..." : "Generate Route"}
          </button>
        </form>
      </div>
    </main>
  );
}
