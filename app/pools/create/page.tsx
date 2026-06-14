"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Car, Bike, Bus, Users as UsersIcon, CheckCircle2, AlertCircle } from "lucide-react";
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
    vehicleType: "car" as "car" | "bike" | "auto" | "van" | "bus",
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
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-4">
          <Link
            href="/pools"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors text-sm font-medium bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Pools
          </Link>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-md">
            {/* Route */}
            <div className="mb-5">
              <h3 className="text-base font-bold text-gray-900 mb-3">Route Details</h3>
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1.5">
                    From <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="from"
                    value={formData.from}
                    onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                    placeholder="Mullassery"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-1.5">
                    To <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="to"
                    value={formData.to}
                    onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                    placeholder="Infopark"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Time & Days */}
            <div className="mb-5">
              <h3 className="text-base font-bold text-gray-900 mb-3">Schedule</h3>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Departure Time <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    id="time"
                    value={formData.departureTime}
                    onChange={(e) => setFormData({ ...formData, departureTime: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Days <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {weekDays.map(day => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                          formData.days.includes(day)
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                  {formData.days.length === 0 && (
                    <p className="mt-1 text-xs text-red-500">Please select at least one day</p>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle & Seats */}
            <div className="mb-5">
              <h3 className="text-base font-bold text-gray-900 mb-3">Vehicle Details</h3>
              
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { value: "bus", label: "Bus", icon: Bus, free: true, color: "green" },
                      { value: "car", label: "Car", icon: Car, free: false, color: "blue" },
                      { value: "bike", label: "Bike", icon: Bike, free: false, color: "blue" },
                      { value: "auto", label: "Auto", icon: UsersIcon, free: false, color: "blue" },
                      { value: "van", label: "Van", icon: Car, free: false, color: "blue" },
                    ].map(({ value, label, icon: Icon, free, color }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setFormData({
                          ...formData,
                          vehicleType: value as any,
                          costPerPerson: free ? "0" : (formData.costPerPerson === "0" ? "" : formData.costPerPerson)
                        })}
                        className={`relative rounded-lg border-2 p-2 flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          formData.vehicleType === value
                            ? color === "green"
                              ? "border-green-500 bg-green-50 shadow-md"
                              : "border-blue-500 bg-blue-50 shadow-md"
                            : color === "green"
                              ? "border-gray-200 hover:border-green-300 hover:bg-green-50/50"
                              : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }`}
                      >
                        {free && (
                          <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">FREE</span>
                        )}
                        <Icon className={`h-4 w-4 ${color === "green" ? "text-green-600" : ""}`} />
                        <span className="text-xs font-medium">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="seats" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Available Seats <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="seats"
                    min="1"
                    max="10"
                    value={formData.seatsAvailable}
                    onChange={(e) => setFormData({ ...formData, seatsAvailable: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Cost & Description */}
            <div className="grid gap-3 md:grid-cols-2">
              {formData.vehicleType === "bus" ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Cost Per Person
                  </label>
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                    <span className="text-green-700 font-bold">Free</span>
                    <span className="text-xs text-green-600">- Networking & Grouping</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1.5">
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
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
              )}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description (Optional)
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={formData.vehicleType === "bus" ? "Bus route details, timing, etc..." : "Any additional details..."}
                  rows={2}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                />
              </div>
            </div>

          </div>

          {/* Message */}
          {message && (
            <div
              className={`rounded-lg border p-3 shadow-md ${
                message.type === "success"
                  ? "border-green-300 bg-green-50"
                  : "border-red-300 bg-red-50"
              }`}
            >
              <div className="flex items-center gap-2">
                {message.type === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-red-600" />
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
          <div>
            <button
              type="submit"
              disabled={loading || formData.days.length === 0}
              className={`w-full rounded-lg px-8 py-2.5 text-base font-semibold text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.vehicleType === 'bus'
                  ? 'bg-gradient-to-r from-green-600 to-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700'
              }`}
            >
              {loading ? "Creating Pool..." : "Create Ride Pool"}
            </button>
            {formData.days.length === 0 && (
              <p className="mt-2 text-xs text-red-500 text-center font-medium">
                Please select at least one day to create a pool
              </p>
            )}
          </div>
        </form>
      </div>
    </PageWrapper>
  );
}
