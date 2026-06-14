/**
 * Busundo Database Schemas
 * Complete type definitions for all collections
 */

import { ObjectId } from "mongodb";

// ============================================
// USER PROFILE & GAMIFICATION
// ============================================

export interface UserProfile {
  _id: ObjectId;
  userId: string; // Auth user ID
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  
  // Gamification
  commuteScore: number; // 0-100
  ecoScore: number; // 0-100
  travelKarma: number; // Total reputation points
  rank: 'Newbie' | 'Commuter' | 'Route Expert' | 'Community Leader' | 'Travel Guru' | 'Legend';
  
  // Stats
  totalTrips: number;
  sharedRides: number;
  fuelSaved: number; // in rupees
  co2Saved: number; // in kg
  routesExplored: number;
  contributionPoints: number;
  
  // Streak
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: Date;
  
  // Badges
  badges: string[]; // Badge IDs
  
  // Preferences
  favoriteRoutes: string[];
  homeLocation?: string;
  workLocation?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================
// STREAK TRACKING
// ============================================

export interface StreakActivity {
  _id: ObjectId;
  userId: string;
  activityType: 'report_crowd' | 'contribute_route' | 'carpool' | 'help_user' | 'verify_data';
  activityDate: Date;
  points: number; // Karma points earned
  metadata?: Record<string, any>;
  createdAt: Date;
}

// ============================================
// KARMA & REPUTATION
// ============================================

export interface KarmaTransaction {
  _id: ObjectId;
  userId: string;
  action: 'report_crowd' | 'contribute_route' | 'contribute_stop' | 'carpool_offer' | 
          'lost_found_help' | 'verify_data' | 'route_champion' | 'streak_milestone';
  points: number; // Can be positive or negative
  description: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface Badge {
  _id: ObjectId;
  badgeId: string;
  name: string;
  description: string;
  icon: string; // Emoji or icon name
  category: 'contribution' | 'social' | 'eco' | 'streak' | 'special';
  requirement: {
    type: 'karma' | 'streak' | 'trips' | 'contributions' | 'special';
    threshold: number;
  };
  createdAt: Date;
}

export interface UserBadge {
  _id: ObjectId;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  metadata?: Record<string, any>;
}

// ============================================
// CROWD METER
// ============================================

export interface CrowdReport {
  _id: ObjectId;
  userId: string;
  routeId: string;
  busNumber?: string;
  crowdLevel: number; // 0-100
  location: {
    lat?: number;
    lng?: number;
    placeName: string;
  };
  timestamp: Date;
  verified: boolean; // Multiple reports increase verification
  upvotes: number;
  downvotes: number;
  createdAt: Date;
}

export interface LiveCrowdData {
  _id: ObjectId;
  routeId: string;
  busNumber?: string;
  currentCrowdLevel: number; // Aggregated from recent reports
  reportsCount: number;
  lastUpdated: Date;
  nextBusETA?: number; // Minutes
  recommendation: 'board' | 'wait' | 'avoid';
}

// ============================================
// LOST & FOUND
// ============================================

export interface LostFoundItem {
  _id: ObjectId;
  type: 'lost' | 'found';
  userId: string;
  
  // Item Details
  itemName: string;
  description: string;
  category: 'bag' | 'electronics' | 'documents' | 'personal' | 'clothing' | 'other';
  imageUrls?: string[];
  
  // Location
  routeId: string;
  location: string;
  busNumber?: string;
  
  // Contact
  contactName: string;
  contactPhone?: string;
  contactEmail?: string;
  
  // Status
  status: 'active' | 'resolved' | 'expired';
  resolvedAt?: Date;
  resolvedBy?: string;
  
  // Engagement
  views: number;
  commentsCount: number;
  sharesCount: number;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date; // Auto-expire after 30 days
}

export interface LostFoundComment {
  _id: ObjectId;
  itemId: ObjectId;
  userId: string;
  userName: string;
  comment: string;
  createdAt: Date;
}

// ============================================
// ROUTE CHAMPIONS
// ============================================

export interface RouteChampion {
  _id: ObjectId;
  routeId: string;
  userId: string;
  
  // Stats
  verifiedUpdates: number;
  postsCount: number;
  helpfulVotes: number;
  
  // Status
  championSince: Date;
  lastActivityDate: Date;
  
  // Badges specific to this route
  routeBadges: string[];
}

// ============================================
// TRAVEL WRAPPED
// ============================================

export interface TravelWrapped {
  _id: ObjectId;
  userId: string;
  year: number;
  
  // Stats
  totalTrips: number;
  totalDistance: number; // km
  moneySaved: number; // rupees
  co2Saved: number; // kg
  routesExplored: number;
  sharedRides: number;
  
  // Top Items
  topRoute: string;
  topCommunity: string;
  topCircle?: string;
  
  // Achievements
  newBadges: string[];
  milestones: string[];
  
  // Sharing
  shared: boolean;
  sharedAt?: Date;
  sharedPlatforms?: string[];
  
  createdAt: Date;
}

// ============================================
// EMERGENCY RIDES
// ============================================

export interface EmergencyRide {
  _id: ObjectId;
  userId: string;
  circleId: string;
  
  // Request Details
  from: string;
  to: string;
  urgency: 'high' | 'medium';
  reason?: string;
  pickupLocation: {
    lat?: number;
    lng?: number;
    address: string;
  };
  
  // Status
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  acceptedBy?: string;
  acceptedAt?: Date;
  completedAt?: Date;
  
  // Notifications
  notifiedUsers: string[];
  
  createdAt: Date;
  expiresAt: Date; // Auto-expire after 30 minutes
}

// ============================================
// BUS BUDDY MATCH
// ============================================

export interface BuddyProfile {
  _id: ObjectId;
  userId: string;
  
  // Commute Pattern
  regularRoutes: string[];
  commuteSchedule: {
    days: string[]; // ['monday', 'tuesday', ...]
    departureTime: string; // '08:30'
    returnTime?: string;
  };
  
  // Preferences
  interests?: string[];
  languages?: string[];
  ageRange?: string;
  gender?: string;
  
  // Privacy
  visible: boolean;
  matchPreferences: {
    sameGender?: boolean;
    ageRange?: string;
    verified?: boolean;
  };
  
  // Stats
  matchesCount: number;
  connectionsCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface BuddyMatch {
  _id: ObjectId;
  user1Id: string;
  user2Id: string;
  
  // Match Details
  matchScore: number; // 0-100
  commonRoutes: string[];
  matchReason: string;
  
  // Status
  status: 'suggested' | 'connected' | 'declined';
  connectedAt?: Date;
  
  createdAt: Date;
}

// ============================================
// COLLEGE & WORKPLACE NETWORKS
// ============================================

export interface Network {
  _id: ObjectId;
  type: 'college' | 'workplace';
  name: string;
  
  // Details
  location: string;
  district: string;
  verified: boolean;
  
  // Stats
  membersCount: number;
  circlesCount: number;
  activeRidesCount: number;
  
  // Features
  features: {
    carpoolBoard: boolean;
    lostFound: boolean;
    routeUpdates: boolean;
  };
  
  // Admins
  adminIds: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface NetworkMember {
  _id: ObjectId;
  networkId: ObjectId;
  userId: string;
  
  // Verification
  verified: boolean;
  verificationMethod?: 'email' | 'id_card' | 'admin';
  
  // Role
  role: 'member' | 'moderator' | 'admin';
  
  // Activity
  lastActiveAt: Date;
  joinedAt: Date;
}

// ============================================
// NOTIFICATIONS
// ============================================

export interface Notification {
  _id: ObjectId;
  userId: string;
  
  // Content
  type: 'streak_reminder' | 'emergency_ride' | 'lost_found_match' | 'badge_earned' | 
        'route_champion' | 'buddy_match' | 'circle_invite' | 'karma_milestone';
  title: string;
  message: string;
  
  // Action
  actionUrl?: string;
  actionLabel?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Status
  read: boolean;
  readAt?: Date;
  
  // Delivery
  channels: ('push' | 'email' | 'sms')[];
  sentAt?: Date;
  
  createdAt: Date;
  expiresAt?: Date;
}

// ============================================
// SOCIAL SHARING
// ============================================

export interface ShareEvent {
  _id: ObjectId;
  userId: string;
  
  // Content
  contentType: 'commute_score' | 'travel_wrapped' | 'badge' | 'route_champion' | 
                'lost_found' | 'crowd_report';
  contentId?: string;
  
  // Platform
  platform: 'instagram' | 'whatsapp' | 'facebook' | 'twitter' | 'copy_link';
  
  // Tracking
  shareUrl?: string;
  clicks?: number;
  conversions?: number; // New installs from this share
  
  createdAt: Date;
}

// ============================================
// ANALYTICS
// ============================================

export interface UserActivity {
  _id: ObjectId;
  userId: string;
  
  // Session
  sessionId: string;
  
  // Activity
  activityType: 'page_view' | 'feature_use' | 'search' | 'share' | 'contribution';
  pagePath?: string;
  featureName?: string;
  
  // Metadata
  metadata?: Record<string, any>;
  
  // Device
  deviceType?: 'mobile' | 'desktop' | 'tablet';
  platform?: 'ios' | 'android' | 'web';
  
  timestamp: Date;
}

export interface FeatureUsage {
  _id: ObjectId;
  featureName: string;
  date: Date; // Daily aggregation
  
  // Metrics
  totalUsers: number;
  newUsers: number;
  sessions: number;
  avgSessionDuration: number;
  
  // Engagement
  shares: number;
  conversions: number;
  
  createdAt: Date;
}

// ============================================
// HELPER TYPES
// ============================================

export interface GeoLocation {
  lat: number;
  lng: number;
  address?: string;
}

export interface TimeRange {
  start: Date;
  end: Date;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
