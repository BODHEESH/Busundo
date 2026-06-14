import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { UserProfile, KarmaTransaction, StreakActivity } from "@/lib/database-schemas";

/**
 * GET /api/user/karma?userId=xxx
 * Get user's karma history and current stats
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const userProfilesCollection = db.collection<UserProfile>("userProfiles");
    const karmaCollection = db.collection<KarmaTransaction>("karmaTransactions");

    // Get user profile
    const userProfile = await userProfilesCollection.findOne({ userId });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get recent karma transactions
    const recentTransactions = await karmaCollection
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    // Calculate karma breakdown by action
    const karmaByAction = await karmaCollection
      .aggregate([
        { $match: { userId } },
        {
          $group: {
            _id: "$action",
            totalPoints: { $sum: "$points" },
            count: { $sum: 1 },
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      success: true,
      data: {
        currentKarma: userProfile.travelKarma,
        rank: userProfile.rank,
        recentTransactions,
        karmaBreakdown: karmaByAction,
      },
    });
  } catch (error: any) {
    console.error("Error fetching karma:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch karma" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/karma
 * Award karma points to a user
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, points, description, metadata } = body;

    if (!userId || !action || !points) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const karmaCollection = db.collection<KarmaTransaction>("karmaTransactions");
    const userProfilesCollection = db.collection<UserProfile>("userProfiles");

    // Create karma transaction
    await karmaCollection.insertOne({
      userId,
      action,
      points,
      description: description || `Earned ${points} karma`,
      metadata: metadata || {},
      createdAt: new Date(),
    } as any);

    // Update user's total karma
    const result = await userProfilesCollection.findOneAndUpdate(
      { userId },
      {
        $inc: { travelKarma: points },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: 'after' }
    );

    // Check for rank upgrade
    const newKarma = result?.travelKarma || 0;
    let newRank = result?.rank || 'Newbie';

    if (newKarma >= 10000) newRank = 'Legend';
    else if (newKarma >= 5000) newRank = 'Travel Guru';
    else if (newKarma >= 2000) newRank = 'Community Leader';
    else if (newKarma >= 500) newRank = 'Route Expert';
    else if (newKarma >= 100) newRank = 'Commuter';

    if (newRank !== result?.rank) {
      await userProfilesCollection.updateOne(
        { userId },
        { $set: { rank: newRank } }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Karma awarded successfully!",
      data: {
        pointsEarned: points,
        totalKarma: newKarma,
        rank: newRank,
        rankUpgraded: newRank !== result?.rank,
      },
    });
  } catch (error: any) {
    console.error("Error awarding karma:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to award karma" },
      { status: 500 }
    );
  }
}
