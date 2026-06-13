"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function CreateCirclePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", description: "", from: "", to: "", isPrivate: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          route: formData.from && formData.to ? { from: formData.from, to: formData.to } : undefined,
          isPrivate: formData.isPrivate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Circle created successfully!" });
        setTimeout(() => router.push(`/circles/${data.circleId}`), 1500);
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
        <Link href="/circles" className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Circles
        </Link>
        <h1 className="font-display text-3xl font-bold mb-2">Create Travel Circle</h1>
        <p className="text-ink/60 mb-8">Create a circle for people with similar travel patterns</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-xl2 border border-line bg-white p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Circle Name <span className="text-signal">*</span></label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Mullassery Techies" className="w-full rounded-lg border border-line px-4 py-2" required />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Description <span className="text-signal">*</span></label>
              <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="IT professionals commuting daily..." rows={4} className="w-full rounded-lg border border-line px-4 py-2" required />
            </div>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">From (Optional)</label>
                <input type="text" value={formData.from} onChange={(e) => setFormData({ ...formData, from: e.target.value })} placeholder="Mullassery" className="w-full rounded-lg border border-line px-4 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">To (Optional)</label>
                <input type="text" value={formData.to} onChange={(e) => setFormData({ ...formData, to: e.target.value })} placeholder="Infopark" className="w-full rounded-lg border border-line px-4 py-2" />
              </div>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isPrivate} onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })} className="rounded" />
                <span className="text-sm font-medium">Make this circle private (invite-only)</span>
              </label>
            </div>
          </div>

          {message && (
            <div className={`rounded-lg border p-4 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
              <div className="flex items-center gap-3">
                {message.type === "success" ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertCircle className="h-5 w-5 text-red-600" />}
                <p className={`text-sm font-medium ${message.type === "success" ? "text-green-800" : "text-red-800"}`}>{message.text}</p>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full rounded-lg bg-gradient-travel px-6 py-3 font-medium text-white hover:shadow-lg disabled:opacity-50">
            {loading ? "Creating Circle..." : "Create Circle"}
          </button>
        </form>
      </div>
    </main>
  );
}
