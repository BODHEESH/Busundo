import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

// ==================== INTERFACES ====================

export interface Community {
  _id?: ObjectId;
  routeId?: string;
  name: string;
  description: string;
  route?: {
    from: string;
    to: string;
  };
  members: ObjectId[];
  moderators: ObjectId[];
  createdBy: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityPost {
  _id?: ObjectId;
  communityId: ObjectId;
  userId: ObjectId;
  userName?: string;
  type: "update" | "question" | "alert" | "discussion";
  title: string;
  content: string;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id?: ObjectId;
  userId: ObjectId;
  userName?: string;
  content: string;
  createdAt: Date;
}

export interface TravelCircle {
  _id?: ObjectId;
  name: string;
  description: string;
  route?: {
    from: string;
    to: string;
  };
  members: ObjectId[];
  admins: ObjectId[];
  createdBy: ObjectId;
  isPrivate: boolean;
  inviteCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CircleMember {
  _id?: ObjectId;
  circleId: ObjectId;
  userId: ObjectId;
  userName?: string;
  role: "admin" | "member";
  joinedAt: Date;
}

// ==================== COLLECTIONS ====================

export async function getCommunitiesCollection() {
  const db = await getDatabase();
  return db.collection<Community>("communities");
}

export async function getCommunityPostsCollection() {
  const db = await getDatabase();
  return db.collection<CommunityPost>("communityPosts");
}

export async function getTravelCirclesCollection() {
  const db = await getDatabase();
  return db.collection<TravelCircle>("travelCircles");
}

export async function getCircleMembersCollection() {
  const db = await getDatabase();
  return db.collection<CircleMember>("circleMembers");
}

// ==================== COMMUNITY FUNCTIONS ====================

/**
 * Create a new community
 */
export async function createCommunity(
  community: Omit<Community, "_id" | "members" | "moderators" | "createdAt" | "updatedAt">
): Promise<ObjectId> {
  const communities = await getCommunitiesCollection();

  const newCommunity: Community = {
    ...community,
    members: [community.createdBy],
    moderators: [community.createdBy],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await communities.insertOne(newCommunity);
  return result.insertedId;
}

/**
 * Get all communities
 */
export async function getAllCommunities(): Promise<Community[]> {
  const communities = await getCommunitiesCollection();
  return await communities.find({}).sort({ createdAt: -1 }).toArray();
}

/**
 * Get community by ID
 */
export async function getCommunityById(id: string): Promise<Community | null> {
  const communities = await getCommunitiesCollection();
  return await communities.findOne({ _id: new ObjectId(id) });
}

/**
 * Join a community
 */
export async function joinCommunity(communityId: string, userId: ObjectId): Promise<void> {
  const communities = await getCommunitiesCollection();

  await communities.updateOne(
    { _id: new ObjectId(communityId) },
    {
      $addToSet: { members: userId },
      $set: { updatedAt: new Date() },
    }
  );
}

/**
 * Leave a community
 */
export async function leaveCommunity(communityId: string, userId: ObjectId): Promise<void> {
  const communities = await getCommunitiesCollection();

  await communities.updateOne(
    { _id: new ObjectId(communityId) },
    {
      $pull: { members: userId },
      $set: { updatedAt: new Date() },
    }
  );
}

/**
 * Create a post in community
 */
export async function createCommunityPost(
  post: Omit<CommunityPost, "_id" | "upvotes" | "downvotes" | "comments" | "createdAt" | "updatedAt">
): Promise<ObjectId> {
  const posts = await getCommunityPostsCollection();

  const newPost: CommunityPost = {
    ...post,
    upvotes: [],
    downvotes: [],
    comments: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await posts.insertOne(newPost);
  return result.insertedId;
}

/**
 * Get posts for a community
 */
export async function getCommunityPosts(communityId: string): Promise<CommunityPost[]> {
  const posts = await getCommunityPostsCollection();
  return await posts
    .find({ communityId: new ObjectId(communityId) })
    .sort({ createdAt: -1 })
    .limit(50)
    .toArray();
}

/**
 * Upvote a post
 */
export async function upvotePost(postId: string, userId: ObjectId): Promise<void> {
  const posts = await getCommunityPostsCollection();

  await posts.updateOne(
    { _id: new ObjectId(postId) },
    {
      $addToSet: { upvotes: userId },
      $pull: { downvotes: userId },
      $set: { updatedAt: new Date() },
    }
  );
}

/**
 * Add comment to post
 */
export async function addComment(
  postId: string,
  userId: ObjectId,
  content: string
): Promise<void> {
  const posts = await getCommunityPostsCollection();

  const comment: Comment = {
    _id: new ObjectId(),
    userId,
    content,
    createdAt: new Date(),
  };

  await posts.updateOne(
    { _id: new ObjectId(postId) },
    {
      $push: { comments: comment },
      $set: { updatedAt: new Date() },
    }
  );
}

// ==================== TRAVEL CIRCLE FUNCTIONS ====================

/**
 * Create a travel circle
 */
export async function createTravelCircle(
  circle: Omit<TravelCircle, "_id" | "members" | "admins" | "inviteCode" | "createdAt" | "updatedAt">
): Promise<ObjectId> {
  const circles = await getTravelCirclesCollection();

  const inviteCode = circle.isPrivate
    ? Math.random().toString(36).substring(2, 8).toUpperCase()
    : undefined;

  const newCircle: TravelCircle = {
    ...circle,
    members: [circle.createdBy],
    admins: [circle.createdBy],
    inviteCode,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await circles.insertOne(newCircle);

  // Add creator as first member
  const members = await getCircleMembersCollection();
  await members.insertOne({
    circleId: result.insertedId,
    userId: circle.createdBy,
    role: "admin",
    joinedAt: new Date(),
  });

  return result.insertedId;
}

/**
 * Get all public circles
 */
export async function getPublicCircles(): Promise<TravelCircle[]> {
  const circles = await getTravelCirclesCollection();
  return await circles.find({ isPrivate: false }).sort({ createdAt: -1 }).toArray();
}

/**
 * Get circle by ID
 */
export async function getCircleById(id: string): Promise<TravelCircle | null> {
  const circles = await getTravelCirclesCollection();
  return await circles.findOne({ _id: new ObjectId(id) });
}

/**
 * Join a circle
 */
export async function joinCircle(circleId: string, userId: ObjectId, inviteCode?: string): Promise<void> {
  const circles = await getTravelCirclesCollection();
  const circle = await circles.findOne({ _id: new ObjectId(circleId) });

  if (!circle) {
    throw new Error("Circle not found");
  }

  if (circle.isPrivate && circle.inviteCode !== inviteCode) {
    throw new Error("Invalid invite code");
  }

  await circles.updateOne(
    { _id: new ObjectId(circleId) },
    {
      $addToSet: { members: userId },
      $set: { updatedAt: new Date() },
    }
  );

  // Add member record
  const members = await getCircleMembersCollection();
  await members.insertOne({
    circleId: new ObjectId(circleId),
    userId,
    role: "member",
    joinedAt: new Date(),
  });
}

/**
 * Leave a circle
 */
export async function leaveCircle(circleId: string, userId: ObjectId): Promise<void> {
  const circles = await getTravelCirclesCollection();

  await circles.updateOne(
    { _id: new ObjectId(circleId) },
    {
      $pull: { members: userId },
      $set: { updatedAt: new Date() },
    }
  );

  // Update member record
  const members = await getCircleMembersCollection();
  await members.deleteOne({
    circleId: new ObjectId(circleId),
    userId,
  });
}

/**
 * Get user's circles
 */
export async function getUserCircles(userId: ObjectId): Promise<TravelCircle[]> {
  const circles = await getTravelCirclesCollection();
  return await circles.find({ members: userId }).sort({ createdAt: -1 }).toArray();
}

/**
 * Get circle members
 */
export async function getCircleMembers(circleId: string): Promise<CircleMember[]> {
  const members = await getCircleMembersCollection();
  return await members.find({ circleId: new ObjectId(circleId) }).toArray();
}
