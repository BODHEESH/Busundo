import { ObjectId } from "mongodb";
import { getDatabase } from "./mongodb";

// ==================== INTERFACES ====================

export interface RidePool {
  _id?: ObjectId;
  createdBy: ObjectId;
  creatorName?: string;
  route: {
    from: string;
    to: string;
  };
  departureTime: string; // "09:00"
  days: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri"]
  seatsAvailable: number;
  totalSeats: number;
  costPerPerson: number;
  vehicleType: "car" | "bike" | "auto" | "van";
  description?: string;
  members: ObjectId[];
  memberNames?: string[];
  status: "active" | "full" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

export interface PoolMember {
  _id?: ObjectId;
  poolId: ObjectId;
  userId: ObjectId;
  userName?: string;
  joinedAt: Date;
  status: "active" | "left";
}

export interface PoolRequest {
  _id?: ObjectId;
  poolId: ObjectId;
  userId: ObjectId;
  userName?: string;
  message?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
}

// ==================== COLLECTIONS ====================

export async function getRidePoolsCollection() {
  const db = await getDatabase();
  return db.collection<RidePool>("ridePools");
}

export async function getPoolMembersCollection() {
  const db = await getDatabase();
  return db.collection<PoolMember>("poolMembers");
}

export async function getPoolRequestsCollection() {
  const db = await getDatabase();
  return db.collection<PoolRequest>("poolRequests");
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Create a new ride pool
 */
export async function createRidePool(pool: Omit<RidePool, "_id" | "members" | "status" | "createdAt" | "updatedAt">): Promise<ObjectId> {
  const pools = await getRidePoolsCollection();
  
  const newPool: RidePool = {
    ...pool,
    members: [pool.createdBy], // Creator is first member
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await pools.insertOne(newPool);
  
  // Add creator as first member
  const members = await getPoolMembersCollection();
  await members.insertOne({
    poolId: result.insertedId,
    userId: pool.createdBy,
    joinedAt: new Date(),
    status: "active",
  });

  return result.insertedId;
}

/**
 * Search for ride pools
 */
export async function searchRidePools(
  from?: string,
  to?: string,
  day?: string,
  time?: string
): Promise<RidePool[]> {
  const pools = await getRidePoolsCollection();
  
  const query: any = { status: "active" };
  
  if (from) {
    query["route.from"] = { $regex: from, $options: "i" };
  }
  
  if (to) {
    query["route.to"] = { $regex: to, $options: "i" };
  }
  
  if (day) {
    query.days = day;
  }
  
  if (time) {
    // Find pools within 1 hour of requested time
    // This is simplified - you can make it more sophisticated
    query.departureTime = time;
  }

  return await pools.find(query).sort({ createdAt: -1 }).limit(50).toArray();
}

/**
 * Get pool by ID
 */
export async function getPoolById(poolId: string): Promise<RidePool | null> {
  const pools = await getRidePoolsCollection();
  return await pools.findOne({ _id: new ObjectId(poolId) });
}

/**
 * Join a ride pool
 */
export async function joinRidePool(poolId: string, userId: ObjectId): Promise<void> {
  const pools = await getRidePoolsCollection();
  const pool = await pools.findOne({ _id: new ObjectId(poolId) });
  
  if (!pool) {
    throw new Error("Pool not found");
  }
  
  if (pool.status !== "active") {
    throw new Error("Pool is not active");
  }
  
  if (pool.members.length >= pool.totalSeats) {
    throw new Error("Pool is full");
  }
  
  if (pool.members.some(m => m.toString() === userId.toString())) {
    throw new Error("Already a member of this pool");
  }

  // Add user to pool members
  await pools.updateOne(
    { _id: new ObjectId(poolId) },
    { 
      $push: { members: userId },
      $inc: { seatsAvailable: -1 },
      $set: { 
        updatedAt: new Date(),
        status: pool.members.length + 1 >= pool.totalSeats ? "full" : "active"
      }
    }
  );

  // Add member record
  const members = await getPoolMembersCollection();
  await members.insertOne({
    poolId: new ObjectId(poolId),
    userId,
    joinedAt: new Date(),
    status: "active",
  });
}

/**
 * Leave a ride pool
 */
export async function leaveRidePool(poolId: string, userId: ObjectId): Promise<void> {
  const pools = await getRidePoolsCollection();
  const pool = await pools.findOne({ _id: new ObjectId(poolId) });
  
  if (!pool) {
    throw new Error("Pool not found");
  }
  
  if (pool.createdBy.toString() === userId.toString()) {
    throw new Error("Pool creator cannot leave. Cancel the pool instead.");
  }

  // Remove user from pool members
  await pools.updateOne(
    { _id: new ObjectId(poolId) },
    { 
      $pull: { members: userId },
      $inc: { seatsAvailable: 1 },
      $set: { 
        updatedAt: new Date(),
        status: "active" // Reopen pool
      }
    }
  );

  // Update member record
  const members = await getPoolMembersCollection();
  await members.updateOne(
    { poolId: new ObjectId(poolId), userId },
    { $set: { status: "left" } }
  );
}

/**
 * Cancel a ride pool (creator only)
 */
export async function cancelRidePool(poolId: string, userId: ObjectId): Promise<void> {
  const pools = await getRidePoolsCollection();
  const pool = await pools.findOne({ _id: new ObjectId(poolId) });
  
  if (!pool) {
    throw new Error("Pool not found");
  }
  
  if (pool.createdBy.toString() !== userId.toString()) {
    throw new Error("Only pool creator can cancel the pool");
  }

  await pools.updateOne(
    { _id: new ObjectId(poolId) },
    { 
      $set: { 
        status: "cancelled",
        updatedAt: new Date()
      }
    }
  );
}

/**
 * Get user's pools
 */
export async function getUserPools(userId: ObjectId): Promise<RidePool[]> {
  const pools = await getRidePoolsCollection();
  
  return await pools.find({
    members: userId,
    status: { $in: ["active", "full"] }
  }).sort({ createdAt: -1 }).toArray();
}

/**
 * Get pools created by user
 */
export async function getCreatedPools(userId: ObjectId): Promise<RidePool[]> {
  const pools = await getRidePoolsCollection();
  
  return await pools.find({
    createdBy: userId
  }).sort({ createdAt: -1 }).toArray();
}

/**
 * Get pool members
 */
export async function getPoolMembers(poolId: string): Promise<PoolMember[]> {
  const members = await getPoolMembersCollection();
  
  return await members.find({
    poolId: new ObjectId(poolId),
    status: "active"
  }).toArray();
}
