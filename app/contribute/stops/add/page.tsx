"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, CheckCircle2, AlertCircle } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

export default function UserAddStopPage() {
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
    setLoading(false);
    setMessage(null);

    try {
      const response = await fetch("/api/contribute/stops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: "Stop submitted successfully! It will be reviewed by our admin team.",
        });
        setFormData({
          stopName: "",
          district: "Thrissur",
          taluk: "Chavakkad",
          latitude: "",
          longitude: "",
          aliases: "",
        });
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
    <PageWrapper
      currentPage="contribute"
      title="Contribute a Stop"
      description="Help the community by adding a new bus stop"
      gradient={true}
    >
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <Link
            href="/contribute"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Contribute
          </Link>
          <div className="flex items-center gap-4 mb-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30">
              <MapPin className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Contribute a Stop
              </h1>
              <p className="mt-1 text-gray-600">
                Add a new bus stop to help the community
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
                    What happens next:
                  </p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Your submission will be reviewed by our admin team</li>
                    <li>• Coordinates are optional but helpful for future map features</li>
                    <li>• Once verified, the stop will go live for everyone</li>
                    <li>• You'll be helping thousands of commuters!</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-xl border p-5 ${
                message.type === "success"
                  ? "border-green-200 bg-green-50"
                  : "border-red-200 bg-red-50"
              }`}
            >
              <div className="flex gap-3">
                {message.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                )}
                <p
                  className={`text-sm ${
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
            {loading ? "Submitting Stop..." : "Submit Stop for Review"}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
