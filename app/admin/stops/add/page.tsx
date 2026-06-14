"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function AddStopPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    stopName: "",
    district: "Thrissur",
    taluk: "Chavakkad",
    latitude: "",
    longitude: "",
    aliases: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const aliases = formData.aliases
        .split(",")
        .map(a => a.trim())
        .filter(a => a.length > 0);

      const response = await fetch("/api/admin/stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          aliases,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        // Reset form
        setFormData({
          stopName: "",
          district: "Thrissur",
          taluk: "Chavakkad",
          latitude: "",
          longitude: "",
          aliases: "",
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/admin/stops");
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20">
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
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Add New Bus Stop
              </h1>
              <p className="mt-1 text-gray-600">
                Add a new bus stop to the database
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Stop Name */}
            <div className="mb-8">
              <label htmlFor="stopName" className="block text-sm font-semibold text-gray-700 mb-2">
                Stop Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="stopName"
                value={formData.stopName}
                onChange={(e) => setFormData({ ...formData, stopName: e.target.value })}
                placeholder="Kurishupally"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
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

            {/* Taluk */}
            <div className="mb-8">
              <label htmlFor="taluk" className="block text-sm font-semibold text-gray-700 mb-2">
                Taluk <span className="text-red-500">*</span>
              </label>
              <select
                id="taluk"
                value={formData.taluk}
                onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              >
                <option value="Chavakkad">Chavakkad</option>
                <option value="Thrissur">Thrissur</option>
                <option value="Kodungallur">Kodungallur</option>
                <option value="Chalakudy">Chalakudy</option>
                <option value="Irinjalakuda">Irinjalakuda</option>
              </select>
            </div>

            {/* Latitude & Longitude */}
            <div className="mb-8 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="block text-sm font-semibold text-gray-700 mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="text"
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="10.5300"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-semibold text-gray-700 mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="text"
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="76.0850"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            {/* Aliases */}
            <div className="mb-8">
              <label htmlFor="aliases" className="block text-sm font-semibold text-gray-700 mb-2">
                Aliases (Optional)
              </label>
              <input
                type="text"
                id="aliases"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                placeholder="Kurishupally Junction, Kurishupally Centre"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <p className="mt-1 text-xs text-gray-400">
                Separate multiple aliases with commas
              </p>
            </div>

            {/* Info Box */}
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200 p-5 shadow-sm">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 mb-1">
                    About coordinates:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Latitude and longitude are optional</li>
                    <li>• They help with map features in the future</li>
                    <li>• You can add them later</li>
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
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-lg font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? "Adding Stop..." : "Add Bus Stop"}
          </button>
        </form>
      </div>
    </main>
  );
}
