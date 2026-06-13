"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Users, MessageSquare, ThumbsUp, Plus, MapPin, Send } from "lucide-react";

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

  if (loading) return <div className="min-h-screen bg-paper flex items-center justify-center"><p>Loading...</p></div>;
  if (!community) return <div className="min-h-screen bg-paper flex items-center justify-center"><p>Community not found</p></div>;

  return (
    <main className="min-h-screen bg-paper">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <Link href="/communities" className="inline-flex items-center gap-2 text-sm text-transit hover:underline mb-4">
          <ArrowLeft className="h-4 w-4" />
          Back to Communities
        </Link>

        <div className="mb-8 rounded-xl2 border border-line bg-white p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-transit/10">
                <Users className="h-6 w-6 text-transit" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold">{community.name}</h1>
                {community.route && (
                  <p className="text-sm text-ink/60 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {community.route.from} ↔ {community.route.to}
                  </p>
                )}
              </div>
            </div>
            <button onClick={handleJoin} className="rounded-lg bg-transit px-4 py-2 text-sm font-medium text-white hover:bg-transit-dark">
              Join Community
            </button>
          </div>
          <p className="text-ink/60 mb-4">{community.description}</p>
          <div className="flex items-center gap-4 text-sm text-ink/60">
            <span className="flex items-center gap-1"><Users className="h-4 w-4" />{community.membersCount} members</span>
            <span className="flex items-center gap-1"><MessageSquare className="h-4 w-4" />{community.posts.length} posts</span>
          </div>
        </div>

        <div className="mb-6">
          <button onClick={() => setShowPostForm(!showPostForm)} className="flex items-center gap-2 rounded-lg bg-gradient-travel px-4 py-2 text-sm font-medium text-white hover:shadow-lg">
            <Plus className="h-4 w-4" />
            Create Post
          </button>
        </div>

        {showPostForm && (
          <form onSubmit={handleCreatePost} className="mb-6 rounded-xl2 border border-line bg-white p-6">
            <select value={postData.type} onChange={(e) => setPostData({ ...postData, type: e.target.value })} className="w-full rounded-lg border border-line px-4 py-2 mb-4">
              <option value="update">Update</option>
              <option value="question">Question</option>
              <option value="alert">Alert</option>
              <option value="discussion">Discussion</option>
            </select>
            <input type="text" value={postData.title} onChange={(e) => setPostData({ ...postData, title: e.target.value })} placeholder="Title" className="w-full rounded-lg border border-line px-4 py-2 mb-4" required />
            <textarea value={postData.content} onChange={(e) => setPostData({ ...postData, content: e.target.value })} placeholder="What's happening?" rows={3} className="w-full rounded-lg border border-line px-4 py-2 mb-4" required />
            <div className="flex gap-2">
              <button type="submit" className="rounded-lg bg-transit px-4 py-2 text-sm font-medium text-white">Post</button>
              <button type="button" onClick={() => setShowPostForm(false)} className="rounded-lg border border-line px-4 py-2 text-sm font-medium">Cancel</button>
            </div>
          </form>
        )}

        <div className="space-y-4">
          {community.posts.map((post) => (
            <div key={post._id} className="rounded-xl2 border border-line bg-white p-6">
              <div className="flex items-start justify-between mb-2">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  post.type === 'alert' ? 'bg-red-100 text-red-700' :
                  post.type === 'question' ? 'bg-blue-100 text-blue-700' :
                  'bg-green-100 text-green-700'
                }`}>{post.type}</span>
                <span className="text-xs text-ink/40">{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <h3 className="font-display font-bold mb-2">{post.title}</h3>
              <p className="text-ink/60 mb-4">{post.content}</p>
              <div className="flex items-center gap-4 text-sm text-ink/60">
                <button className="flex items-center gap-1 hover:text-transit"><ThumbsUp className="h-4 w-4" />{post.upvotes}</button>
                <button className="flex items-center gap-1 hover:text-transit"><MessageSquare className="h-4 w-4" />{post.comments}</button>
              </div>
            </div>
          ))}
          {community.posts.length === 0 && (
            <div className="text-center py-12 rounded-xl2 border border-line bg-white">
              <MessageSquare className="h-12 w-12 text-ink/20 mx-auto mb-4" />
              <p className="text-ink/60">No posts yet. Be the first to post!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
