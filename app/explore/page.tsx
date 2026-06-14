"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Star, Users, TrendingUp, Compass, Mountain, Waves, TreePine, Camera, Utensils, Heart, Award, Eye, Navigation } from "lucide-react"
import PageWrapper from "@/components/shared/PageWrapper"

const categories = [
  { name: "Waterfalls", icon: Waves, color: "from-blue-500 to-cyan-500" },
  { name: "Beaches", icon: Waves, color: "from-yellow-400 to-orange-500" },
  { name: "Mountains", icon: Mountain, color: "from-green-600 to-emerald-700" },
  { name: "Forests", icon: TreePine, color: "from-green-500 to-teal-600" },
  { name: "Temples", icon: Mountain, color: "from-orange-500 to-red-500" },
  { name: "Photography Spots", icon: Camera, color: "from-purple-500 to-pink-500" },
  { name: "Food Trails", icon: Utensils, color: "from-red-500 to-orange-600" },
  { name: "Hidden Gems", icon: Award, color: "from-indigo-500 to-purple-600" }
]

const trendingPlaces = [
  {
    id: 1,
    name: "Athirappilly Waterfalls",
    location: "Thrissur",
    image: "/placeholder-waterfall.jpg",
    rating: 4.8,
    reviews: 1234,
    crowdLevel: "Moderate",
    category: "Waterfalls",
    slug: "athirappilly-waterfalls"
  },
  {
    id: 2,
    name: "Vagamon",
    location: "Idukki",
    image: "/placeholder-mountain.jpg",
    rating: 4.7,
    reviews: 892,
    crowdLevel: "Low",
    category: "Mountains",
    slug: "vagamon"
  },
  {
    id: 3,
    name: "Illikkal Kallu",
    location: "Kottayam",
    image: "/placeholder-mountain.jpg",
    rating: 4.9,
    reviews: 567,
    crowdLevel: "Moderate",
    category: "Mountains",
    slug: "illikkal-kallu"
  },
  {
    id: 4,
    name: "Vazhachal Falls",
    location: "Thrissur",
    image: "/placeholder-waterfall.jpg",
    rating: 4.6,
    reviews: 445,
    crowdLevel: "Busy",
    category: "Waterfalls",
    slug: "vazhachal-falls"
  }
]

const hiddenGems = [
  {
    id: 1,
    name: "Kakkayam Dam",
    location: "Kozhikode",
    discoveredBy: "Rahul Kumar",
    visits: 89,
    rating: 4.9,
    slug: "kakkayam-dam"
  },
  {
    id: 2,
    name: "Marottichal Waterfalls",
    location: "Thrissur",
    discoveredBy: "Priya Menon",
    visits: 156,
    rating: 4.8,
    slug: "marottichal-waterfalls"
  },
  {
    id: 3,
    name: "Charpa Falls",
    location: "Thrissur",
    discoveredBy: "Arun Das",
    visits: 234,
    rating: 4.7,
    slug: "charpa-falls"
  }
]

const weekendGetaways = [
  {
    title: "Top 10 Waterfalls in Kerala",
    places: 10,
    image: "/placeholder-collection.jpg"
  },
  {
    title: "Best One Day Trips from Thrissur",
    places: 8,
    image: "/placeholder-collection.jpg"
  },
  {
    title: "Hidden Places Near Kochi",
    places: 12,
    image: "/placeholder-collection.jpg"
  }
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <PageWrapper currentPage="explore">
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Compass className="h-5 w-5 text-yellow-300" />
                <span className="text-sm font-semibold">Discover Kerala</span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Where would you like to
                <br />
                <span className="text-yellow-300">explore today?</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Discover amazing destinations and plan your perfect journey with BusUndo
              </p>
              
              {/* Search Bar */}
              <div className="max-w-3xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search destinations... (e.g., Athirappilly, Vagamon, Illikkal Kallu)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl text-gray-900 text-lg focus:outline-none focus:ring-4 focus:ring-yellow-300 shadow-2xl"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                  {["Athirappilly", "Vagamon", "Illikkal Kallu", "Kakkayam"].map((example) => (
                    <button
                      key={example}
                      onClick={() => setSearchQuery(example)}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-sm transition-colors"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Explore by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/explore/category/${category.name.toLowerCase().replace(/ /g, '-')}`}
                  className="group"
                >
                  <div className="text-center">
                    <div className={`w-full aspect-square rounded-2xl bg-gradient-to-br ${category.color} p-6 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg`}>
                      <category.icon className="h-10 w-10 text-white" />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {category.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trending Places */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Trending Destinations</h2>
                <p className="text-gray-600">Most visited places this week</p>
              </div>
              <Link href="/explore/trending" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                View All
                <TrendingUp className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingPlaces.map((place) => (
                <Link
                  key={place.id}
                  href={`/explore/${place.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                      {place.category}
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {place.crowdLevel}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {place.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <MapPin className="h-4 w-4" />
                      {place.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold text-gray-900">{place.rating}</span>
                        <span className="text-sm text-gray-500">({place.reviews})</span>
                      </div>
                      <Navigation className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Hidden Gems */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <Award className="h-8 w-8 text-yellow-500" />
                  Hidden Gems
                </h2>
                <p className="text-gray-600">Community discovered destinations</p>
              </div>
              <Link href="/explore/hidden-gems" className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                Discover More
                <Compass className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {hiddenGems.map((gem) => (
                <Link
                  key={gem.id}
                  href={`/explore/${gem.slug}`}
                  className="group bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-yellow-400 p-2 rounded-lg">
                      <Award className="h-6 w-6 text-yellow-900" />
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-gray-900">{gem.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {gem.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <MapPin className="h-4 w-4" />
                    {gem.location}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-gray-600">
                      Discovered by <span className="font-semibold text-gray-900">{gem.discoveredBy}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600">
                      <Eye className="h-4 w-4" />
                      {gem.visits}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Weekend Getaways */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Weekend Getaways</h2>
                <p className="text-gray-600">Curated collections for your next adventure</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {weekendGetaways.map((collection, index) => (
                <Link
                  key={index}
                  href={`/explore/collections/${collection.title.toLowerCase().replace(/ /g, '-')}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <Heart className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-3xl font-bold">{collection.places}</p>
                      <p className="text-sm">Places</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                      {collection.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Know a hidden gem?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Share your favorite destinations with the BusUndo community
            </p>
            <Link
              href="/explore/add-place"
              className="inline-flex items-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-300 hover:text-blue-900 transition-all hover:scale-105 shadow-xl"
            >
              <Award className="h-6 w-6" />
              Add a Place
            </Link>
          </div>
        </section>
      </main>
    </PageWrapper>
  )
}
