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
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <div className="mx-auto max-w-4xl px-4 py-12">
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
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30">
              <Bus className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Route
              </h1>
              <p className="mt-1 text-gray-600">
                Create a new bus route in 30 seconds
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Route ID */}
            <div className="mb-8">
              <label htmlFor="routeId" className="block text-sm font-semibold text-gray-700 mb-2">
                Route ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="routeId"
                value={formData.routeId}
                onChange={(e) => setFormData({ ...formData, routeId: e.target.value })}
                placeholder="PB021"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Example: PB021, PB022, etc.
              </p>
            </div>

            {/* Route Name */}
            <div className="mb-8">
              <label htmlFor="routeName" className="block text-sm font-semibold text-gray-700 mb-2">
                Route Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="routeName"
                value={formData.routeName}
                onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                placeholder="Thrissur-Kodakara"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <p className="mt-1 text-xs text-gray-400">
                Example: Thrissur-Kodakara, Mullassery-Punnayur
              </p>
            </div>

            {/* District */}
            <div className="mb-8">
              <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-2">
                District <span className="text-red-500">*</span>
              </label>
              <select
                id="district"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="Thrissur">Thrissur</option>
                <option value="Ernakulam">Ernakulam</option>
                <option value="Palakkad">Palakkad</option>
                <option value="Malappuram">Malappuram</option>
              </select>
            </div>

            {/* Stops */}
            <div className="mb-8">
              <label htmlFor="stops" className="block text-sm font-semibold text-gray-700 mb-2">
                Stops (one per line) <span className="text-red-500">*</span>
              </label>
              <textarea
                id="stops"
                value={formData.stops}
                onChange={(e) => setFormData({ ...formData, stops: e.target.value })}
                placeholder={`Sakthan Stand\nOllur\nPudukad\nKodakara`}
                rows={10}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <div className="mt-2 flex items-center justify-between">
                <p className="text-xs text-gray-400">
                  Paste stop names, one per line
                </p>
                <p className="text-xs font-medium text-blue-600">
                  {stopCount} {stopCount === 1 ? "stop" : "stops"}
                </p>
              </div>
            </div>

            {/* Info Box */}
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200 p-5 shadow-sm">
              <div className="flex gap-3">
                <Bus className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-blue-900 mb-1">
                    How it works:
                  </p>
                  <ul className="space-y-1 text-gray-600">
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
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Creating Route..." : "Generate Route"}
          </button>
        </form>
      </div>
    </main>
  );
}
