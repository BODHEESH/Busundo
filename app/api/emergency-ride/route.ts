import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { EmergencyRide } from "@/lib/database-schemas";
import { ObjectId } from "mongodb";

/**
 * POST /api/emergency-ride
 * Create an emergency ride request
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, circleId, from, to, urgency, reason, pickupLocation } = body;

    if (!userId || !circleId || !from || !to || !pickupLocation) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const emergencyRidesCollection = db.collection<EmergencyRide>("emergencyRides");
    const circlesCollection = db.collection("circles");
    const notificationsCollection = db.collection("notifications");

    // Get circle members
    const circle = await circlesCollection.findOne({ _id: new ObjectId(circleId) });

    if (!circle) {
      return NextResponse.json(
        { success: false, error: "Circle not found" },
        { status: 404 }
      );
    }

    // Create emergency ride
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Expire after 30 minutes

    const emergencyRide: Omit<EmergencyRide, '_id'> = {
      userId,
      circleId,
      from,
      to,
      urgency: urgency || 'high',
      reason,
      pickupLocation: {
        lat: pickupLocation.lat,
        lng: pickupLocation.lng,
        address: pickupLocation.address,
      },
      status: 'pending',
      notifiedUsers: [],
      createdAt: new Date(),
      expiresAt,
    };

    const result = await emergencyRidesCollection.insertOne(emergencyRide as any);

    // Notify all circle members
    const memberIds = circle.members || [];
    const notifications = memberIds
      .filter((memberId: string) => memberId !== userId) // Don't notify requester
      .map((memberId: string) => ({
        userId: memberId,
        type: 'emergency_ride',
        title: '🚨 Emergency Ride Request',
        message: `${circle.name} member needs urgent ride from ${from} to ${to}`,
        actionUrl: `/emergency-ride/${result.insertedId}`,
        actionLabel: 'View Request',
        metadata: {
          emergencyRideId: result.insertedId.toString(),
          circleId,
          from,
          to,
        },
        read: false,
        channels: ['push', 'sms'],
        createdAt: new Date(),
        expiresAt,
      }));

    if (notifications.length > 0) {
      await notificationsCollection.insertMany(notifications);
    }

    // Update notified users
    await emergencyRidesCollection.updateOne(
      { _id: result.insertedId },
      { $set: { notifiedUsers: memberIds.filter((id: string) => id !== userId) } }
    );

    return NextResponse.json({
      success: true,
      message: `Emergency ride request sent to ${notifications.length} circle members!`,
      data: {
        emergencyRideId: result.insertedId,
        notifiedCount: notifications.length,
        expiresAt,
      },
    });
  } catch (error: any) {
    console.error("Error creating emergency ride:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create emergency ride" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/emergency-ride?circleId=xxx
 * Get emergency rides for a circle
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const circleId = searchParams.get("circleId");
    const userId = searchParams.get("userId");

    if (!circleId && !userId) {
      return NextResponse.json(
        { success: false, error: "circleId or userId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const emergencyRidesCollection = db.collection<EmergencyRide>("emergencyRides");

    const query: any = { status: 'pending' };
    if (circleId) query.circleId = circleId;
    if (userId) query.userId = userId;

    const rides = await emergencyRidesCollection
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: rides,
    });
  } catch (error: any) {
    console.error("Error fetching emergency rides:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch rides" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/emergency-ride/:id
 * Accept or complete an emergency ride
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { rideId, action, userId } = body;

    if (!rideId || !action || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const emergencyRidesCollection = db.collection<EmergencyRide>("emergencyRides");
    const karmaCollection = db.collection("karmaTransactions");
    const notificationsCollection = db.collection("notifications");

    const ride = await emergencyRidesCollection.findOne({ _id: new ObjectId(rideId) });

    if (!ride) {
      return NextResponse.json(
        { success: false, error: "Ride not found" },
        { status: 404 }
      );
    }

    let updateData: any = {};
    let karmaPoints = 0;
    let message = "";

    if (action === 'accept') {
      updateData = {
        status: 'accepted',
        acceptedBy: userId,
        acceptedAt: new Date(),
      };
      karmaPoints = 50;
      message = "Emergency ride accepted! +50 karma";

      // Notify requester
      await notificationsCollection.insertOne({
        userId: ride.userId,
        type: 'emergency_ride',
        title: '✅ Ride Accepted!',
        message: `Your emergency ride request has been accepted`,
        actionUrl: `/emergency-ride/${rideId}`,
        actionLabel: 'View Details',
        read: false,
        channels: ['push'],
        createdAt: new Date(),
      });
    } else if (action === 'complete') {
      updateData = {
        status: 'completed',
        completedAt: new Date(),
      };
      karmaPoints = 25; // Bonus for completion
      message = "Emergency ride completed! +25 bonus karma";
    } else if (action === 'cancel') {
      updateData = {
        status: 'cancelled',
      };
      message = "Emergency ride cancelled";
    }

    await emergencyRidesCollection.updateOne(
      { _id: new ObjectId(rideId) },
      { $set: updateData }
    );

    // Award karma
    if (karmaPoints > 0) {
      await karmaCollection.insertOne({
        userId,
        action: 'carpool_offer',
        points: karmaPoints,
        description: message,
        metadata: { emergencyRideId: rideId },
        createdAt: new Date(),
      });

      await db.collection("userProfiles").updateOne(
        { userId },
        { $inc: { travelKarma: karmaPoints } }
      );
    }

    return NextResponse.json({
      success: true,
      message,
      data: { karmaEarned: karmaPoints },
    });
  } catch (error: any) {
    console.error("Error updating emergency ride:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update ride" },
      { status: 500 }
    );
  }
}
