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
            Add New Bus Stop
          </h1>
          <p className="mt-2 text-ink/60">
            Add a new bus stop to the database
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up">
          <div className="rounded-xl2 border border-line bg-white p-6">
            {/* Stop Name */}
            <div className="mb-6">
              <label htmlFor="stopName" className="block text-sm font-medium mb-2">
                Stop Name <span className="text-signal">*</span>
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

            {/* Taluk */}
            <div className="mb-6">
              <label htmlFor="taluk" className="block text-sm font-medium mb-2">
                Taluk <span className="text-signal">*</span>
              </label>
              <select
                id="taluk"
                value={formData.taluk}
                onChange={(e) => setFormData({ ...formData, taluk: e.target.value })}
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
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
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="block text-sm font-medium mb-2">
                  Latitude (Optional)
                </label>
                <input
                  type="text"
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  placeholder="10.5300"
                  className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                />
              </div>
              <div>
                <label htmlFor="longitude" className="block text-sm font-medium mb-2">
                  Longitude (Optional)
                </label>
                <input
                  type="text"
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  placeholder="76.0850"
                  className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                />
              </div>
            </div>

            {/* Aliases */}
            <div className="mb-6">
              <label htmlFor="aliases" className="block text-sm font-medium mb-2">
                Aliases (Optional)
              </label>
              <input
                type="text"
                id="aliases"
                value={formData.aliases}
                onChange={(e) => setFormData({ ...formData, aliases: e.target.value })}
                placeholder="Kurishupally Junction, Kurishupally Centre"
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
              />
              <p className="mt-1 text-xs text-ink/40">
                Separate multiple aliases with commas
              </p>
            </div>

            {/* Info Box */}
            <div className="rounded-lg bg-signal/5 border border-signal/20 p-4">
              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-signal flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-signal mb-1">
                    About coordinates:
                  </p>
                  <ul className="space-y-1 text-ink/60">
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
            className="w-full rounded-lg bg-gradient-travel px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding Stop..." : "Add Bus Stop"}
          </button>
        </form>
      </div>
    </main>
  );
}
