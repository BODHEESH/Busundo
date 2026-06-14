import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Waterfalls', 'Beaches', 'Mountains', 'Forests', 'Temples', 'Churches', 'Mosques', 'Lakes', 'Adventure', 'Camping', 'Photography Spots', 'Family Destinations', 'Food Trails', 'Hidden Gems']
  },
  district: {
    type: String,
    required: true
  },
  taluk: String,
  description: {
    type: String,
    required: true
  },
  history: String,
  highlights: [String],
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  images: [{
    url: String,
    caption: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  crowdLevel: {
    type: String,
    enum: ['Low', 'Moderate', 'Busy', 'Packed'],
    default: 'Moderate'
  },
  entryFee: {
    amount: Number,
    currency: {
      type: String,
      default: 'INR'
    },
    details: String
  },
  bestTime: {
    from: String,
    to: String,
    description: String
  },
  bestSeason: {
    type: String,
    enum: ['Summer', 'Monsoon', 'Winter', 'All Year']
  },
  facilities: [{
    type: String,
    enum: ['Parking', 'Restrooms', 'Food Court', 'Guide Service', 'First Aid', 'Wheelchair Access', 'Photography Allowed', 'Camping Allowed']
  }],
  tags: [String],
  hiddenGem: {
    type: Boolean,
    default: false
  },
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  contributedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  nearbyAttractions: [{
    placeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place'
    },
    distance: Number,
    travelTime: Number
  }],
  nearbyFood: [{
    name: String,
    type: String,
    distance: Number,
    rating: Number
  }],
  travelTips: [{
    tip: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    upvotes: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  views: {
    type: Number,
    default: 0
  },
  visits: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

PlaceSchema.index({ slug: 1 });
PlaceSchema.index({ category: 1 });
PlaceSchema.index({ district: 1 });
PlaceSchema.index({ rating: -1 });
PlaceSchema.index({ location: '2dsphere' });

export default mongoose.models.Place || mongoose.model('Place', PlaceSchema);
