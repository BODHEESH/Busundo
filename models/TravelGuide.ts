import mongoose from 'mongoose';

const TravelGuideSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  destinationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  description: String,
  duration: {
    days: Number,
    nights: Number
  },
  itinerary: [{
    day: Number,
    title: String,
    activities: [{
      time: String,
      activity: String,
      location: String,
      duration: String,
      cost: Number
    }],
    meals: [{
      type: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snacks']
      },
      place: String,
      cost: Number
    }],
    accommodation: {
      name: String,
      type: String,
      cost: Number
    }
  }],
  estimatedCost: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    breakdown: {
      transport: Number,
      food: Number,
      accommodation: Number,
      activities: Number,
      miscellaneous: Number
    }
  },
  travelTime: {
    total: String,
    fromMajorCities: [{
      city: String,
      time: String,
      distance: Number
    }]
  },
  bestTimeToVisit: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Difficult']
  },
  suitableFor: [{
    type: String,
    enum: ['Solo', 'Couple', 'Family', 'Friends', 'Adventure Seekers', 'Photography']
  }],
  inclusions: [String],
  exclusions: [String],
  thingsToPack: [String],
  safetyTips: [String],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  verified: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

TravelGuideSchema.index({ destinationId: 1 });
TravelGuideSchema.index({ slug: 1 });
TravelGuideSchema.index({ rating: -1 });

export default mongoose.models.TravelGuide || mongoose.model('TravelGuide', TravelGuideSchema);
