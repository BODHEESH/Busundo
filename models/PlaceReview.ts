import mongoose from 'mongoose';

const PlaceReviewSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Place',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    required: true,
    trim: true
  },
  photos: [{
    url: String,
    caption: String
  }],
  visitDate: Date,
  helpful: {
    type: Number,
    default: 0
  },
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  verified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

PlaceReviewSchema.index({ placeId: 1, createdAt: -1 });
PlaceReviewSchema.index({ userId: 1 });
PlaceReviewSchema.index({ rating: -1 });

export default mongoose.models.PlaceReview || mongoose.model('PlaceReview', PlaceReviewSchema);
