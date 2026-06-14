"use client"

import { useState } from "react"
import { Award, MapPin, Image as ImageIcon, DollarSign, Calendar, Info } from "lucide-react"
import PageWrapper from "@/components/shared/PageWrapper"

const categories = [
  "Waterfalls", "Beaches", "Mountains", "Forests", "Temples", 
  "Churches", "Mosques", "Lakes", "Adventure", "Camping", 
  "Photography Spots", "Family Destinations", "Food Trails", "Hidden Gems"
]

const districts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
]

const facilities = [
  "Parking", "Restrooms", "Food Court", "Guide Service", 
  "First Aid", "Wheelchair Access", "Photography Allowed", "Camping Allowed"
]

export default function AddPlacePage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    district: "",
    taluk: "",
    description: "",
    history: "",
    highlights: "",
    latitude: "",
    longitude: "",
    entryFee: "",
    entryFeeDetails: "",
    bestTimeFrom: "",
    bestTimeTo: "",
    bestTimeDescription: "",
    bestSeason: "",
    facilities: [] as string[],
    tags: "",
    travelTips: "",
    estimatedCost: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFacilityToggle = (facility: string) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.includes(facility)
        ? formData.facilities.filter(f => f !== facility)
        : [...formData.facilities, facility]
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // API call to submit place
    console.log("Submitting place:", formData)
    alert("Place submitted for review! Our team will verify and publish it soon.")
  }

  return (
    <PageWrapper currentPage="explore">
      <main className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full mb-4">
              <Award className="h-5 w-5" />
              <span className="font-semibold">Contribute to BusUndo</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Add a Hidden Gem
            </h1>
            <p className="text-xl text-gray-600">
              Share your favorite destination with the community
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
            {/* Basic Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="h-6 w-6 text-blue-600" />
                Basic Information
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Place Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Athirappilly Waterfalls"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      District *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    >
                      <option value="">Select district</option>
                      {districts.map(dist => (
                        <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Taluk
                  </label>
                  <input
                    type="text"
                    name="taluk"
                    value={formData.taluk}
                    onChange={handleChange}
                    placeholder="e.g., Chalakudy"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Describe the place, what makes it special..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    History (Optional)
                  </label>
                  <textarea
                    name="history"
                    value={formData.history}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Any historical significance or background..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Highlights (One per line)
                  </label>
                  <textarea
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleChange}
                    rows={4}
                    placeholder="80 feet high waterfall&#10;Best during monsoon&#10;Featured in movies"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="h-6 w-6 text-blue-600" />
                Location
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Latitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 10.2854"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Longitude *
                  </label>
                  <input
                    type="number"
                    step="any"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    required
                    placeholder="e.g., 76.5697"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Tip: You can get coordinates from Google Maps by right-clicking on the location
              </p>
            </div>

            {/* Visit Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Calendar className="h-6 w-6 text-blue-600" />
                Visit Information
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Best Time From
                    </label>
                    <input
                      type="text"
                      name="bestTimeFrom"
                      value={formData.bestTimeFrom}
                      onChange={handleChange}
                      placeholder="e.g., June"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Best Time To
                    </label>
                    <input
                      type="text"
                      name="bestTimeTo"
                      value={formData.bestTimeTo}
                      onChange={handleChange}
                      placeholder="e.g., September"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Best Season
                  </label>
                  <select
                    name="bestSeason"
                    value={formData.bestSeason}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  >
                    <option value="">Select season</option>
                    <option value="Summer">Summer</option>
                    <option value="Monsoon">Monsoon</option>
                    <option value="Winter">Winter</option>
                    <option value="All Year">All Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Entry Fee */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-blue-600" />
                Entry Fee
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="entryFee"
                    value={formData.entryFee}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Details
                  </label>
                  <input
                    type="text"
                    name="entryFeeDetails"
                    value={formData.entryFeeDetails}
                    onChange={handleChange}
                    placeholder="e.g., ₹30 per person, ₹50 for camera"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Facilities Available</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {facilities.map(facility => (
                  <label key={facility} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.facilities.includes(facility)}
                      onChange={() => handleFacilityToggle(facility)}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">{facility}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="e.g., waterfall, nature, photography, family friendly"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Travel Tips (One per line)
                  </label>
                  <textarea
                    name="travelTips"
                    value={formData.travelTips}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Visit before 9 AM to avoid crowds&#10;Wear comfortable shoes&#10;Carry water and snacks"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estimated Cost for a Visit (₹)
                  </label>
                  <input
                    type="number"
                    name="estimatedCost"
                    value={formData.estimatedCost}
                    onChange={handleChange}
                    placeholder="e.g., 500"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600"
                  />
                  <p className="text-sm text-gray-600 mt-2">
                    Include transport, entry fee, food, etc.
                  </p>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-6 border-t">
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> Your submission will be reviewed by our team before being published. 
                  This helps maintain quality and accuracy of information.
                </p>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Award className="h-6 w-6" />
                Submit for Review
              </button>
            </div>
          </form>
        </div>
      </main>
    </PageWrapper>
  )
}
