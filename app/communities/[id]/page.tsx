"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, MessageSquare, ThumbsUp, Plus, MapPin } from "lucide-react";

interface Post {
  _id: string;
  type: string;
  title: string;
  content: string;
  upvotes: number;
  comments: number;
  createdAt: string;
}

interface CommunityData {
  _id: string;
  name: string;
  description: string;
  route?: { from: string; to: string };
  membersCount: number;
  posts: Post[];
}

export default function CommunityDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [community, setCommunity] = useState<CommunityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postData, setPostData] = useState({ type: "update", title: "", content: "" });

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      const response = await fetch(`/api/communities/${id}`);
      const data = await response.json();
      if (response.ok) setCommunity(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      await fetch(`/api/communities/${id}/join`, { method: "POST" });
      fetchCommunity();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch(`/api/communities/${id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      setPostData({ type: "update", title: "", content: "" });
      setShowPostForm(false);
      fetchCommunity();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>;
  if (!community) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Community not found</p></div>;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        {/* Back Link */}
        <Link href="/communities" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>

        {/* Community Info Card */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{community.name}</h1>
                {community.route && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-500" />
                    {community.route.from} ↔ {community.route.to}
                  </div>
                )}
              </div>
            </div>
            <button onClick={handleJoin} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm">
              Join Community
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">{community.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1"><Users className="h-4 w-4 text-gray-400" />{community.membersCount} members</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4 text-gray-400" />{community.posts.length} posts</span>
          </div>
        </div>

        {/* Create Post Button */}
        <div className="mb-6">
          <button onClick={() => setShowPostForm(!showPostForm)} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:shadow-lg transition-all">
            <Plus className="h-4 w-4" />
            Create Post
          </button>
        </div>

        {/* Post Form */}
        {showPostForm && (
          <form onSubmit={handleCreatePost} className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <select value={postData.type} onChange={(e) => setPostData({ ...postData, type: e.target.value })} className="w-full rounded-lg border border-gray-200 px-3 py-2 mb-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
              <option value="update">Update</option>
              <option value="question">Question</option>
              <option value="alert">Alert</option>
              <option value="discussion">Discussion</option>
            </select>
            <input type="text" value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} placeholder="Title" className="w-full rounded-lg border border-gray-200 px-3 py-2 mb-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20" required />
            <textarea value={postData.content} onChange={(e) => setPostData({ ...postData, content: e.target.value })} placeholder="What's happening?" rows={3} className="w-full rounded-lg border border-gray-200 px-3 py-2 mb-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none" required />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">Post</button>
              <button type="button" onClick={() => setShowPostForm(false)} className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
            </div>
          </form>
        )}

        {/* Posts */}
        <div className="space-y-4">
          {community.posts.map((post) => (
            <div key={post._id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  post.type === 'alert' ? 'bg-red-50 text-red-600' :
                  post.type === 'question' ? 'bg-blue-50 text-blue-600' :
                  'bg-green-50 text-green-600'
                }`}>{post.type}</span>
                <span className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{post.title}</h3>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 pt-3 border-t border-gray-100">
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><ThumbsUp className="h-4 w-4" />{post.upvotes}</button>
                <button className="flex items-center gap-1.5 hover:text-blue-600 transition-colors"><MessageSquare className="h-4 w-4" />{post.comments}</button>
              </div>
            </div>
          ))}
          {community.posts.length === 0 && (
            <div className="text-center py-12 rounded-xl border border-gray-200 bg-white">
              <MessageSquare className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
