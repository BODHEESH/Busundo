import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { UserProfile, StreakActivity, KarmaTransaction } from "@/lib/database-schemas";

/**
 * GET /api/user/streak?userId=xxx
 * Get user's streak information
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
    const streakCollection = db.collection<StreakActivity>("streakActivities");

    const userProfile = await userProfilesCollection.findOne({ userId });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get recent activities
    const recentActivities = await streakCollection
      .find({ userId })
      .sort({ activityDate: -1 })
      .limit(30)
      .toArray();

    // Calculate next milestone
    const currentStreak = userProfile.currentStreak;
    const milestones = [7, 15, 30, 50, 100, 365];
    const nextMilestone = milestones.find(m => m > currentStreak) || milestones[milestones.length - 1];

    return NextResponse.json({
      success: true,
      data: {
        currentStreak: userProfile.currentStreak,
        longestStreak: userProfile.longestStreak,
        lastActivityDate: userProfile.lastActivityDate,
        nextMilestone,
        progress: (currentStreak / nextMilestone) * 100,
        recentActivities,
      },
    });
  } catch (error: any) {
    console.error("Error fetching streak:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch streak" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/streak
 * Record a streak activity and update streak
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityType, metadata } = body;

    if (!userId || !activityType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const userProfilesCollection = db.collection<UserProfile>("userProfiles");
    const streakCollection = db.collection<StreakActivity>("streakActivities");
    const karmaCollection = db.collection<KarmaTransaction>("karmaTransactions");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if user already has activity today
    const todayActivity = await streakCollection.findOne({
      userId,
      activityDate: { $gte: today },
    });

    if (todayActivity) {
      return NextResponse.json({
        success: true,
        message: "Streak already recorded for today",
        data: { alreadyRecorded: true },
      });
    }

    // Get user profile
    const userProfile = await userProfilesCollection.findOne({ userId });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Calculate new streak
    const lastActivity = userProfile.lastActivityDate;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (lastActivity) {
      const lastActivityDate = new Date(lastActivity);
      lastActivityDate.setHours(0, 0, 0, 0);

      if (lastActivityDate.getTime() === yesterday.getTime()) {
        // Consecutive day
        newStreak = userProfile.currentStreak + 1;
      } else if (lastActivityDate.getTime() < yesterday.getTime()) {
        // Streak broken
        newStreak = 1;
      } else {
        // Same day (shouldn't happen due to check above)
        newStreak = userProfile.currentStreak;
      }
    }

    // Record activity
    const points = 5; // Base points for maintaining streak
    await streakCollection.insertOne({
      userId,
      activityType,
      activityDate: today,
      points,
      metadata: metadata || {},
      createdAt: new Date(),
    } as any);

    // Update user profile
    const longestStreak = Math.max(newStreak, userProfile.longestStreak);
    await userProfilesCollection.updateOne(
      { userId },
      {
        $set: {
          currentStreak: newStreak,
          longestStreak,
          lastActivityDate: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    // Check for milestone achievements
    const milestones = [7, 15, 30, 50, 100, 365];
    const achievedMilestone = milestones.find(m => m === newStreak);

    if (achievedMilestone) {
      const bonusKarma = achievedMilestone * 10; // 7 days = 70 karma, etc.
      
      await karmaCollection.insertOne({
        userId,
        action: 'streak_milestone',
        points: bonusKarma,
        description: `Achieved ${achievedMilestone}-day streak!`,
        metadata: { milestone: achievedMilestone },
        createdAt: new Date(),
      } as any);

      await userProfilesCollection.updateOne(
        { userId },
        { $inc: { travelKarma: bonusKarma } }
      );

      return NextResponse.json({
        success: true,
        message: `🔥 ${achievedMilestone}-day streak milestone achieved!`,
        data: {
          currentStreak: newStreak,
          longestStreak,
          milestoneAchieved: achievedMilestone,
          bonusKarma,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "Streak updated successfully!",
      data: {
        currentStreak: newStreak,
        longestStreak,
        streakContinued: newStreak > 1,
      },
    });
  } catch (error: any) {
    console.error("Error updating streak:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update streak" },
      { status: 500 }
    );
  }
}
