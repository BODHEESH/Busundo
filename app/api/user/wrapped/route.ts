import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { TravelWrapped, UserProfile } from "@/lib/database-schemas";

/**
 * GET /api/user/wrapped?userId=xxx&year=2026
 * Generate or retrieve Travel Wrapped for a user
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const year = parseInt(searchParams.get("year") || new Date().getFullYear().toString());

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const wrappedCollection = db.collection<TravelWrapped>("travelWrapped");
    const userProfilesCollection = db.collection<UserProfile>("userProfiles");

    // Check if wrapped already exists
    let wrapped = await wrappedCollection.findOne({ userId, year });

    if (!wrapped) {
      // Generate new wrapped
      const userProfile = await userProfilesCollection.findOne({ userId });

      if (!userProfile) {
        return NextResponse.json(
          { success: false, error: "User not found" },
          { status: 404 }
        );
      }

      // Aggregate data from various collections
      const yearStart = new Date(year, 0, 1);
      const yearEnd = new Date(year, 11, 31, 23, 59, 59);

      // Get trips data (you'll need to track this)
      const tripsCollection = db.collection("trips");
      const trips = await tripsCollection
        .find({
          userId,
          createdAt: { $gte: yearStart, $lte: yearEnd },
        })
        .toArray();

      // Get carpool data
      const carpoolCollection = db.collection("carpools");
      const carpools = await carpoolCollection
        .find({
          userId,
          createdAt: { $gte: yearStart, $lte: yearEnd },
        })
        .toArray();

      // Get contributions
      const contributionsCollection = db.collection("contributions");
      const contributions = await contributionsCollection
        .find({
          userId,
          createdAt: { $gte: yearStart, $lte: yearEnd },
        })
        .toArray();

      // Calculate stats
      const totalTrips = trips.length;
      const totalDistance = trips.reduce((sum: number, t: any) => sum + (t.distance || 0), 0);
      const sharedRides = carpools.length;
      
      // Estimate savings (₹10 per km saved by carpooling)
      const moneySaved = sharedRides * 50 + contributions.length * 10;
      
      // Estimate CO2 saved (0.12 kg per km by carpooling)
      const co2Saved = Math.round(sharedRides * 5 + totalDistance * 0.05);

      // Get unique routes
      const uniqueRoutes = new Set(trips.map((t: any) => t.routeId));
      const routesExplored = uniqueRoutes.size;

      // Find top route
      const routeCounts: any = {};
      trips.forEach((t: any) => {
        routeCounts[t.routeId] = (routeCounts[t.routeId] || 0) + 1;
      });
      const topRoute = Object.keys(routeCounts).reduce((a, b) => 
        routeCounts[a] > routeCounts[b] ? a : b, 
        Object.keys(routeCounts)[0] || "N/A"
      );

      // Get badges earned this year
      const userBadgesCollection = db.collection("userBadges");
      const newBadges = await userBadgesCollection
        .find({
          userId,
          earnedAt: { $gte: yearStart, $lte: yearEnd },
        })
        .toArray();

      // Create wrapped
      wrapped = {
        userId,
        year,
        totalTrips,
        totalDistance,
        moneySaved,
        co2Saved,
        routesExplored,
        sharedRides,
        topRoute,
        topCommunity: "Thrissur-Chavakkad", // TODO: Calculate from actual data
        topCircle: undefined,
        newBadges: newBadges.map((b: any) => b.badgeId),
        milestones: [],
        shared: false,
        createdAt: new Date(),
      } as any;

      await wrappedCollection.insertOne(wrapped as any);
    }

    return NextResponse.json({
      success: true,
      data: wrapped,
    });
  } catch (error: any) {
    console.error("Error generating wrapped:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate wrapped" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/wrapped/share
 * Record that user shared their wrapped
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, year, platform } = body;

    if (!userId || !year) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const wrappedCollection = db.collection<TravelWrapped>("travelWrapped");
    const shareEventsCollection = db.collection("shareEvents");

    // Update wrapped
    await wrappedCollection.updateOne(
      { userId, year },
      {
        $set: {
          shared: true,
          sharedAt: new Date(),
        },
        $addToSet: {
          sharedPlatforms: platform,
        },
      }
    );

    // Record share event
    await shareEventsCollection.insertOne({
      userId,
      contentType: 'travel_wrapped',
      contentId: `${userId}-${year}`,
      platform,
      createdAt: new Date(),
    });

    // Award karma for sharing
    const karmaCollection = db.collection("karmaTransactions");
    await karmaCollection.insertOne({
      userId,
      action: 'streak_milestone',
      points: 50,
      description: "Shared Travel Wrapped",
      metadata: { year, platform },
      createdAt: new Date(),
    });

    await db.collection("userProfiles").updateOne(
      { userId },
      { $inc: { travelKarma: 50 } }
    );

    return NextResponse.json({
      success: true,
      message: "Wrapped shared successfully! +50 karma",
    });
  } catch (error: any) {
    console.error("Error sharing wrapped:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to share wrapped" },
      { status: 500 }
    );
  }
}
