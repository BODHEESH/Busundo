"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Car, Bike, Users as UsersIcon, CheckCircle2, AlertCircle } from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

export default function CreatePoolPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureTime: "09:00",
    days: [] as string[],
    seatsAvailable: 3,
    costPerPerson: "",
    vehicleType: "car" as "car" | "bike" | "auto" | "van",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter(d => d !== day)
        : [...prev.days, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/pools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          route: {
            from: formData.from,
            to: formData.to,
          },
          departureTime: formData.departureTime,
          days: formData.days,
          seatsAvailable: formData.seatsAvailable,
          costPerPerson: formData.costPerPerson,
          vehicleType: formData.vehicleType,
          description: formData.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Pool created successfully!" });
        setTimeout(() => {
          router.push(`/pools/${data.poolId}`);
        }, 1500);
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
      currentPage="pools"
      title="Create New Pool"
      description="Share your ride and split costs with fellow commuters"
      gradient={true}
    >
      <div className="mx-auto max-w-3xl px-4">
        <div className="mb-8">
          <Link
            href="/pools"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Link>
          <h1 className="text-4xl font-bold text-white mb-4">
            Create Ride Pool
          </h1>
          <p className="text-lg text-blue-100">
            Share your daily commute and save costs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
            {/* Route */}
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Route Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="from" className="block text-sm font-semibold text-gray-700 mb-2">
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Mullassery"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="to" className="block text-sm font-semibold text-gray-700 mb-2">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Infopark"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Time & Days */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Schedule</h3>
              
              <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                  Departure Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Days <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                        formData.days.includes(day)
                          ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white shadow-md"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>
                {formData.days.length === 0 && (
                  <p className="mt-1 text-xs text-signal">Please select at least one day</p>
                )}
              </div>
            </div>

            {/* Vehicle & Seats */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Vehicle Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Vehicle Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "car", label: "Car", icon: Car },
                    { value: "bike", label: "Bike", icon: Bike },
                    { value: "auto", label: "Auto", icon: UsersIcon },
                    { value: "van", label: "Van", icon: Car },
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData({ ...formData, vehicleType: value as any })}
                      className={`rounded-xl border-2 p-4 flex flex-col items-center gap-2 transition-all cursor-pointer ${
                        formData.vehicleType === value
                          ? "border-pink-500 bg-pink-50 shadow-md"
                          : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="seats" className="block text-sm font-semibold text-gray-700 mb-2">
                  Available Seats <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="seats"
                  min="1"
                  max="10"
                  value={formData.seatsAvailable}
                  onChange={(e) => setFormData({ ...formData, seatsAvailable: parseInt(e.target.value) })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {/* Cost */}
            <div className="mb-8">
              <label htmlFor="cost" className="block text-sm font-semibold text-gray-700 mb-2">
                Cost Per Person (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="cost"
                min="0"
                step="10"
                value={formData.costPerPerson}
                onChange={(e) => setFormData({ ...formData, costPerPerson: e.target.value })}
                placeholder="50"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                💡 Suggested cost per person for this route
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any additional details about the pool..."
                rows={3}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-2xl border p-6 shadow-lg animate-fade-in-up ${
                message.type === "success"
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
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

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || formData.days.length === 0}
              className="w-full rounded-full bg-gradient-to-r from-pink-600 to-pink-700 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? "Creating Pool..." : "Create Ride Pool"}
            </button>
            {formData.days.length === 0 && (
              <p className="mt-3 text-sm text-red-500 text-center font-medium">
                ⚠️ Please select at least one day to create a pool
              </p>
            )}
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
