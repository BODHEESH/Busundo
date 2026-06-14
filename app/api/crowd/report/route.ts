import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { CrowdReport, LiveCrowdData, KarmaTransaction } from "@/lib/database-schemas";

/**
 * POST /api/crowd/report
 * Submit a crowd level report for a bus
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, routeId, busNumber, crowdLevel, location } = body;

    // Validation
    if (!userId || !routeId || crowdLevel === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (crowdLevel < 0 || crowdLevel > 100) {
      return NextResponse.json(
        { success: false, error: "Crowd level must be between 0 and 100" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const crowdReportsCollection = db.collection<CrowdReport>("crowdReports");
    const liveCrowdCollection = db.collection<LiveCrowdData>("liveCrowdData");
    const karmaCollection = db.collection<KarmaTransaction>("karmaTransactions");

    // Create crowd report
    const crowdReport: Omit<CrowdReport, '_id'> = {
      userId,
      routeId,
      busNumber,
      crowdLevel,
      location: {
        lat: location?.lat,
        lng: location?.lng,
        placeName: location?.placeName || "Unknown",
      },
      timestamp: new Date(),
      verified: false,
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date(),
    };

    const result = await crowdReportsCollection.insertOne(crowdReport as any);

    // Update live crowd data (aggregate recent reports)
    const recentReports = await crowdReportsCollection
      .find({
        routeId,
        timestamp: { $gte: new Date(Date.now() - 30 * 60 * 1000) }, // Last 30 minutes
      })
      .toArray();

    const avgCrowdLevel = Math.round(
      recentReports.reduce((sum, r) => sum + r.crowdLevel, 0) / recentReports.length
    );

    const recommendation = 
      avgCrowdLevel > 75 ? 'avoid' : 
      avgCrowdLevel > 50 ? 'wait' : 
      'board';

    await liveCrowdCollection.updateOne(
      { routeId, busNumber },
      {
        $set: {
          currentCrowdLevel: avgCrowdLevel,
          reportsCount: recentReports.length,
          lastUpdated: new Date(),
          recommendation,
        },
      },
      { upsert: true }
    );

    // Award karma points
    const karmaPoints = 10;
    await karmaCollection.insertOne({
      userId,
      action: 'report_crowd',
      points: karmaPoints,
      description: `Reported crowd level for ${routeId}`,
      metadata: { routeId, crowdLevel },
      createdAt: new Date(),
    } as any);

    // Update user's karma and streak
    await db.collection("userProfiles").updateOne(
      { userId },
      {
        $inc: { travelKarma: karmaPoints },
        $set: { lastActivityDate: new Date() },
      }
    );

    return NextResponse.json({
      success: true,
      message: "Crowd report submitted successfully!",
      data: {
        reportId: result.insertedId,
        karmaEarned: karmaPoints,
        currentCrowdLevel: avgCrowdLevel,
        recommendation,
      },
    });
  } catch (error: any) {
    console.error("Error submitting crowd report:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit report" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/crowd/report?routeId=xxx
 * Get recent crowd reports for a route
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const routeId = searchParams.get("routeId");

    if (!routeId) {
      return NextResponse.json(
        { success: false, error: "routeId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const liveCrowdCollection = db.collection<LiveCrowdData>("liveCrowdData");

    const liveCrowdData = await liveCrowdCollection.findOne({ routeId });

    if (!liveCrowdData) {
      return NextResponse.json({
        success: true,
        data: {
          routeId,
          currentCrowdLevel: 0,
          reportsCount: 0,
          recommendation: 'board',
          message: "No recent reports available",
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: liveCrowdData,
    });
  } catch (error: any) {
    console.error("Error fetching crowd data:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch crowd data" },
      { status: 500 }
    );
  }
}
