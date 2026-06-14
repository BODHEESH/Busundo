"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Users, Calendar, DollarSign, Clock, Navigation, Camera, Heart, Share2, Award, TrendingUp, CloudRain, Sun, ThumbsUp, MessageSquare, Utensils, Compass, Bus, ArrowRight } from "lucide-react"
import PageWrapper from "@/components/shared/PageWrapper"

export default function PlaceDetailsPage({ params }: { params: { slug: string } }) {
  const [selectedTab, setSelectedTab] = useState("about")
  const [sourceLocation, setSourceLocation] = useState("")
  const [showTravelPlan, setShowTravelPlan] = useState(false)

  // Mock data - will be replaced with actual API call
  const place = {
    name: "Athirappilly Waterfalls",
    slug: "athirappilly-waterfalls",
    category: "Waterfalls",
    district: "Thrissur",
    taluk: "Chalakudy",
    rating: 4.8,
    reviewCount: 1234,
    crowdLevel: "Moderate",
    description: "Athirappilly Falls is the largest waterfall in Kerala, located on the Chalakudy River. Often called the 'Niagara of India', it's a spectacular sight with water cascading from a height of 80 feet.",
    history: "The falls have been a popular tourist destination for decades and have been featured in numerous Indian films.",
    highlights: [
      "80 feet high waterfall",
      "Best during monsoon season",
      "Featured in Bollywood movies",
      "Rich biodiversity in surrounding forests"
    ],
    bestTime: {
      from: "June",
      to: "September",
      description: "Monsoon season offers the most spectacular views"
    },
    bestSeason: "Monsoon",
    entryFee: {
      amount: 30,
      details: "₹30 per person, ₹50 for camera"
    },
    facilities: ["Parking", "Restrooms", "Food Court", "Guide Service"],
    tags: ["Waterfall", "Nature", "Photography", "Family Friendly"],
    images: [
      { url: "/placeholder-waterfall.jpg", caption: "Main waterfall view" },
      { url: "/placeholder-waterfall.jpg", caption: "Monsoon season" },
      { url: "/placeholder-waterfall.jpg", caption: "Surrounding forest" }
    ],
    weather: {
      temp: 28,
      condition: "Partly Cloudy",
      rain: "40% chance"
    },
    nearbyAttractions: [
      { name: "Vazhachal Falls", distance: 5, travelTime: 15 },
      { name: "Charpa Falls", distance: 8, travelTime: 20 },
      { name: "Thumboormuzhi", distance: 12, travelTime: 25 }
    ],
    nearbyFood: [
      { name: "Rainforest Restaurant", type: "Multi-cuisine", rating: 4.5, distance: 1 },
      { name: "Falls View Cafe", type: "Snacks & Beverages", rating: 4.2, distance: 0.5 }
    ],
    travelTips: [
      { tip: "Visit before 9 AM to avoid crowds", upvotes: 234, author: "Rahul Kumar" },
      { tip: "Wear comfortable shoes for trekking", upvotes: 189, author: "Priya Menon" },
      { tip: "Carry water and snacks", upvotes: 156, author: "Arun Das" }
    ],
    reviews: [
      {
        id: 1,
        author: "Rahul Kumar",
        rating: 5,
        date: "2 days ago",
        review: "Absolutely breathtaking! The waterfall is magnificent during monsoon. Must visit!",
        helpful: 45,
        photos: []
      },
      {
        id: 2,
        author: "Priya Menon",
        rating: 4,
        date: "1 week ago",
        review: "Beautiful place but gets very crowded on weekends. Go early morning for best experience.",
        helpful: 32,
        photos: []
      }
    ]
  }

  const handleFindRoute = () => {
    setShowTravelPlan(true)
  }

  return (
    <PageWrapper currentPage="explore">
      <main className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative h-[500px] bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold">
                  {place.category}
                </span>
                <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                  <Star className="h-4 w-4 fill-gray-900" />
                  {place.rating}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{place.name}</h1>
              <div className="flex flex-wrap items-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  {place.district}, {place.taluk}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Crowd: {place.crowdLevel}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {place.reviewCount} reviews
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button className="bg-white text-blue-700 px-6 py-3 rounded-full font-bold hover:bg-yellow-300 hover:text-blue-900 transition-all flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Save
                </button>
                <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-bold hover:bg-white/30 transition-all flex items-center gap-2">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <section className="bg-white border-b sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 overflow-x-auto">
              {["about", "reviews", "travel-plan", "photos"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`py-4 px-2 font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    selectedTab === tab
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace("-", " ")}
                </button>
              ))}
            </div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About Section */}
              {selectedTab === "about" && (
                <>
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">{place.description}</p>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Highlights</h3>
                    <ul className="space-y-2 mb-6">
                      {place.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-3 text-gray-700">
                          <Star className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                          {highlight}
                        </li>
                      ))}
                    </ul>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          Best Time to Visit
                        </h3>
                        <p className="text-gray-700">{place.bestTime.from} - {place.bestTime.to}</p>
                        <p className="text-sm text-gray-600 mt-1">{place.bestTime.description}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-green-600" />
                          Entry Fee
                        </h3>
                        <p className="text-gray-700 font-semibold">₹{place.entryFee.amount}</p>
                        <p className="text-sm text-gray-600 mt-1">{place.entryFee.details}</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">Facilities</h3>
                      <div className="flex flex-wrap gap-2">
                        {place.facilities.map((facility, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Travel Tips */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Compass className="h-6 w-6 text-blue-600" />
                      Community Travel Tips
                    </h2>
                    <div className="space-y-4">
                      {place.travelTips.map((tip, index) => (
                        <div key={index} className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
                          <p className="text-gray-800 mb-2">{tip.tip}</p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">by {tip.author}</span>
                            <button className="flex items-center gap-1 text-blue-600 hover:text-blue-700">
                              <ThumbsUp className="h-4 w-4" />
                              {tip.upvotes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Attractions */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Nearby Attractions</h2>
                    <div className="space-y-4">
                      {place.nearbyAttractions.map((attraction, index) => (
                        <Link
                          key={index}
                          href={`/explore/${attraction.name.toLowerCase().replace(/ /g, '-')}`}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors group"
                        >
                          <div>
                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600">{attraction.name}</h3>
                            <p className="text-sm text-gray-600">{attraction.distance} km away • {attraction.travelTime} min</p>
                          </div>
                          <Navigation className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Nearby Food */}
                  <div className="bg-white rounded-2xl p-8 shadow-lg">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <Utensils className="h-6 w-6 text-orange-600" />
                      Nearby Food Spots
                    </h2>
                    <div className="space-y-4">
                      {place.nearbyFood.map((food, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                          <div>
                            <h3 className="font-bold text-gray-900">{food.name}</h3>
                            <p className="text-sm text-gray-600">{food.type} • {food.distance} km</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold">{food.rating}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Reviews Section */}
              {selectedTab === "reviews" && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
                      Write a Review
                    </button>
                  </div>
                  <div className="space-y-6">
                    {place.reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-gray-900">{review.author}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-3">{review.review}</p>
                        <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                          <ThumbsUp className="h-4 w-4" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel Plan Section */}
              {selectedTab === "travel-plan" && (
                <div className="bg-white rounded-2xl p-8 shadow-lg">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Bus className="h-6 w-6 text-blue-600" />
                    Can I Reach Here?
                  </h2>
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Where are you starting from?
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your location (e.g., Mullassery, Thrissur)"
                      value={sourceLocation}
                      onChange={(e) => setSourceLocation(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <button
                    onClick={handleFindRoute}
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    Find Best Route
                    <ArrowRight className="h-5 w-5" />
                  </button>

                  {showTravelPlan && (
                    <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                      <h3 className="font-bold text-lg text-gray-900 mb-4">Your Travel Plan</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">Bus 1: Mullassery → Chalakudy</span>
                            <span className="text-sm text-gray-600">45 min</span>
                          </div>
                          <p className="text-sm text-gray-600">Route: Via NH 544</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900">Bus 2: Chalakudy → Athirappilly</span>
                            <span className="text-sm text-gray-600">30 min</span>
                          </div>
                          <p className="text-sm text-gray-600">Route: Via Athirappilly Road</p>
                        </div>
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                          <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                              <p className="text-sm opacity-90">Total Time</p>
                              <p className="text-xl font-bold">1h 15m</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-90">Est. Cost</p>
                              <p className="text-xl font-bold">₹60</p>
                            </div>
                            <div>
                              <p className="text-sm opacity-90">Distance</p>
                              <p className="text-xl font-bold">55 km</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Link
                        href="/search-bus"
                        className="mt-4 block text-center bg-white text-blue-700 px-6 py-3 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                      >
                        View Detailed Route
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Weather Widget */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  Current Weather
                </h3>
                <div className="text-center">
                  <p className="text-5xl font-bold mb-2">{place.weather.temp}°C</p>
                  <p className="text-blue-100 mb-4">{place.weather.condition}</p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <CloudRain className="h-4 w-4" />
                    {place.weather.rain}
                  </div>
                </div>
              </div>

              {/* Crowd Meter */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Crowd Level
                </h3>
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full font-bold text-lg mb-4">
                    {place.crowdLevel}
                  </div>
                  <p className="text-sm text-gray-600">Best time: Early morning (6-9 AM)</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/search-bus"
                    className="block w-full bg-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center"
                  >
                    Find Bus Route
                  </Link>
                  <Link
                    href="/communities"
                    className="block w-full bg-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors text-center"
                  >
                    Join Travel Community
                  </Link>
                  <Link
                    href="/circles/create"
                    className="block w-full bg-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors text-center"
                  >
                    Create Travel Circle
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageWrapper>
  )
}
