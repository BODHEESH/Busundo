"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package,
  Search,
  Plus,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Share2,
} from "lucide-react";
import PageWrapper from "@/components/shared/PageWrapper";

interface LostItem {
  _id: string;
  type: 'lost' | 'found';
  itemName: string;
  description: string;
  category: string;
  route: string;
  location: string;
  date: string;
  contactName: string;
  status: 'active' | 'resolved';
  imageUrl?: string;
  commentsCount: number;
}

export default function LostFoundPage() {
  const [filter, setFilter] = useState<'all' | 'lost' | 'found'>('all');
  const [showReportForm, setShowReportForm] = useState(false);

  // Mock data
  const items: LostItem[] = [
    {
      _id: '1',
      type: 'lost',
      itemName: 'Black Backpack',
      description: 'Black backpack with laptop inside. Has a red keychain.',
      category: 'Bag',
      route: 'Thrissur → Chavakkad',
      location: 'Near Guruvayur',
      date: '2 hours ago',
      contactName: 'Ravi Kumar',
      status: 'active',
      commentsCount: 3,
    },
    {
      _id: '2',
      type: 'found',
      itemName: 'Blue Water Bottle',
      description: 'Milton blue water bottle found on seat',
      category: 'Personal Item',
      route: 'Mullassery → Thrissur',
      location: 'Thrissur Bus Stand',
      date: '1 day ago',
      contactName: 'Priya M',
      status: 'active',
      commentsCount: 1,
    },
    {
      _id: '3',
      type: 'lost',
      itemName: 'Mobile Phone',
      description: 'Samsung Galaxy phone in black case',
      category: 'Electronics',
      route: 'Chavakkad → Thrissur',
      location: 'Near Punnayur',
      date: '3 hours ago',
      contactName: 'Arjun S',
      status: 'resolved',
      commentsCount: 5,
    },
  ];

  const categories = ['Bag', 'Electronics', 'Personal Item', 'Documents', 'Clothing', 'Other'];

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  return (
    <PageWrapper
      currentPage="lost-found"
      title="Lost & Found"
      description="Community-powered lost and found network"
      gradient
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Hero Header */}
        <div className="mb-12 text-center animate-fade-in">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-2xl shadow-pink-500/40 mb-6">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Lost & Found Network
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Lost something on the bus? Found something? Let the community help!
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setShowReportForm(!showReportForm)}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Report Lost/Found Item
            </button>
            <button className="px-8 py-4 rounded-xl border-2 border-gray-300 bg-white text-gray-700 font-bold hover:border-pink-500 hover:bg-pink-50 transition-all hover:scale-105 flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Items
            </button>
          </div>
        </div>

        {/* Report Form */}
        {showReportForm && (
          <div className="mb-10 rounded-2xl border-2 border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 p-8 shadow-xl animate-slide-in-up">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Report an Item</h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                    <option>Lost Item</option>
                    <option>Found Item</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                    {categories.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  placeholder="e.g., Black Backpack"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the item in detail..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Route</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20">
                    <option>Thrissur → Chavakkad</option>
                    <option>Mullassery → Thrissur</option>
                    <option>Chavakkad → Thrissur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="e.g., Near Guruvayur"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Contact Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500/20"
                />
              </div>

              <button className="w-full px-8 py-4 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105">
                Submit Report
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="mb-8 flex items-center gap-4 border-b border-gray-200">
          <button
            onClick={() => setFilter('all')}
            className={`pb-4 px-4 font-bold transition-all ${
              filter === 'all'
                ? 'border-b-4 border-pink-600 text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter('lost')}
            className={`pb-4 px-4 font-bold transition-all ${
              filter === 'lost'
                ? 'border-b-4 border-pink-600 text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Lost Items
          </button>
          <button
            onClick={() => setFilter('found')}
            className={`pb-4 px-4 font-bold transition-all ${
              filter === 'found'
                ? 'border-b-4 border-pink-600 text-pink-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Found Items
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-6 animate-slide-in-up">
          {filteredItems.map((item, index) => (
            <div
              key={item._id}
              className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden hover:shadow-xl transition-all"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl ${
                      item.type === 'lost' 
                        ? 'bg-gradient-to-br from-red-500 to-rose-500' 
                        : 'bg-gradient-to-br from-green-500 to-emerald-500'
                    } shadow-md`}>
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          item.type === 'lost'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {item.type === 'lost' ? 'LOST' : 'FOUND'}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-bold">
                          {item.category}
                        </span>
                        {item.status === 'resolved' && (
                          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            RESOLVED
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.itemName}</h3>
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span className="font-semibold">{item.route}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {item.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {item.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" />
                          {item.commentsCount} comments
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button className="px-6 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white font-bold hover:shadow-lg transition-all flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Contact
                    </button>
                    <button className="px-6 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-bold hover:border-pink-500 hover:bg-pink-50 transition-all flex items-center gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Posted by <span className="font-semibold text-gray-900">{item.contactName}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <p className="text-4xl font-bold text-gray-900 mb-2">247</p>
            <p className="text-gray-600">Items Reported</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <p className="text-4xl font-bold text-green-600 mb-2">189</p>
            <p className="text-gray-600">Items Reunited</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg text-center">
            <p className="text-4xl font-bold text-blue-600 mb-2">76%</p>
            <p className="text-gray-600">Success Rate</p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
