"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, Lock, Unlock, MapPin, Shield, Calendar } from "lucide-react";

interface Member {
  userId: string;
  role: string;
  joinedAt: string;
}

interface CircleData {
  _id: string;
  name: string;
  description: string;
  route?: { from: string; to: string };
  membersCount: number;
  isPrivate: boolean;
  inviteCode?: string;
  createdAt: string;
  members: Member[];
}

export default function CircleDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [circle, setCircle] = useState<CircleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [joinError, setJoinError] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    fetchCircle();
  }, [id]);

  const fetchCircle = async () => {
    try {
      const response = await fetch(`/api/circles/${id}`);
      const data = await response.json();
      if (response.ok) setCircle(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    setJoinError("");
    try {
      const response = await fetch(`/api/circles/${id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: circle?.isPrivate ? inviteCode : undefined }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchCircle();
      } else {
        setJoinError(data.error || "Failed to join");
      }
    } catch (error) {
      setJoinError("Something went wrong");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!circle) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Circle not found</p></div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Back Link */}
        <Link href="/circles" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Circles
        </Link>

        {/* Circle Info Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                {circle.isPrivate ? (
                  <Lock className="h-6 w-6 text-blue-600" />
                ) : (
                  <Unlock className="h-6 w-6 text-blue-600" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{circle.name}</h1>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${circle.isPrivate ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                    {circle.isPrivate ? (
                      <><Lock className="h-3 w-3" /> Private</>
                    ) : (
                      <><Unlock className="h-3 w-3" /> Public</>
                    )}
                  </span>
                </div>
                {circle.route && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    {circle.route.from} → {circle.route.to}
                  </div>
                )}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{circle.description}</p>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1"><Users className="h-4 w-4 text-gray-400" />{circle.membersCount} members</span>
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4 text-gray-400" />{new Date(circle.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>

          {/* Join Section */}
          <div className="pt-4 border-t border-gray-100">
            {circle.isPrivate && (
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Invite Code</label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            )}
            {joinError && <p className="text-sm text-red-500 mb-2">{joinError}</p>}
            <button
              onClick={handleJoin}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Join Circle
            </button>
          </div>
        </div>

        {/* Members Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Members ({circle.members.length})
          </h2>

          {circle.members.length > 0 ? (
            <div className="space-y-3">
              {circle.members.map((member) => (
                <div key={member.userId} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Member</p>
                      <p className="text-xs text-gray-500">Joined {new Date(member.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                  {member.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                      <Shield className="h-3 w-3" />
                      Admin
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No members yet. Be the first to join!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
