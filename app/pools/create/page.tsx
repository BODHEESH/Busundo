"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Car, Bike, Users as UsersIcon, CheckCircle2, AlertCircle } from "lucide-react";

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
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <Link
            href="/pools"
            className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Create Ride Pool
          </h1>
          <p className="mt-2 text-ink/60">
            Share your daily commute and save costs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 animate-slide-in-up">
          <div className="rounded-xl2 border border-line bg-white p-6">
            {/* Route */}
            <div className="mb-6">
              <h3 className="font-display font-bold mb-4">Route Details</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="from" className="block text-sm font-medium mb-2">
                    From <span className="text-signal">*</span>
                  </label>
                  <input
                    type="text"
                    id="from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Mullassery"
                    className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="to" className="block text-sm font-medium mb-2">
                    To <span className="text-signal">*</span>
                  </label>
                  <input
                    type="text"
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Infopark"
                    className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Time & Days */}
            <div className="mb-6">
              <h3 className="font-display font-bold mb-4">Schedule</h3>
              
              <div className="mb-4">
                <label htmlFor="time" className="block text-sm font-medium mb-2">
                  Departure Time <span className="text-signal">*</span>
                </label>
                <input
                  type="time"
                  id="time"
                  value={formData.departureTime}
                  onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                  className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Days <span className="text-signal">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {weekDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                        formData.days.includes(day)
                          ? "bg-transit text-white"
                          : "bg-gray-100 text-ink/60 hover:bg-gray-200"
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
            <div className="mb-6">
              <h3 className="font-display font-bold mb-4">Vehicle Details</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Vehicle Type <span className="text-signal">*</span>
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
                      className={`rounded-lg border p-4 flex flex-col items-center gap-2 transition-all ${
                        formData.vehicleType === value
                          ? "border-transit bg-transit/5"
                          : "border-line hover:border-transit/50"
                      }`}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="seats" className="block text-sm font-medium mb-2">
                  Available Seats <span className="text-signal">*</span>
                </label>
                <input
                  type="number"
                  id="seats"
                  min="1"
                  max="10"
                  value={formData.seatsAvailable}
                  onChange={(e) => setFormData({ ...formData, seatsAvailable: parseInt(e.target.value) })}
                  className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                  required
                />
              </div>
            </div>

            {/* Cost */}
            <div className="mb-6">
              <label htmlFor="cost" className="block text-sm font-medium mb-2">
                Cost Per Person (₹) <span className="text-signal">*</span>
              </label>
              <input
                type="number"
                id="cost"
                min="0"
                step="10"
                value={formData.costPerPerson}
                onChange={(e) => setFormData({ ...formData, costPerPerson: e.target.value })}
                placeholder="50"
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
                required
              />
              <p className="mt-1 text-xs text-ink/40">
                Suggested cost per person for this route
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-2">
                Description (Optional)
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Any additional details about the pool..."
                rows={3}
                className="w-full rounded-lg border border-line px-4 py-2 focus:border-transit focus:outline-none focus:ring-2 focus:ring-transit/20"
              />
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

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading || formData.days.length === 0}
              className="w-full rounded-lg bg-gradient-travel px-6 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Pool..." : "Create Ride Pool"}
            </button>
            {formData.days.length === 0 && (
              <p className="mt-2 text-xs text-signal text-center">
                Please select at least one day to create a pool
              </p>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
