import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { BuddyProfile, BuddyMatch } from "@/lib/database-schemas";
import { ObjectId } from "mongodb";

/**
 * POST /api/buddy-match/profile
 * Create or update buddy profile
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, regularRoutes, commuteSchedule, interests, matchPreferences } = body;

    if (!userId || !regularRoutes || !commuteSchedule) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const buddyProfilesCollection = db.collection<BuddyProfile>("buddyProfiles");

    const profile: Partial<BuddyProfile> = {
      userId,
      regularRoutes,
      commuteSchedule,
      interests: interests || [],
      matchPreferences: matchPreferences || {},
      visible: true,
      updatedAt: new Date(),
    };

    const result = await buddyProfilesCollection.updateOne(
      { userId },
      {
        $set: profile,
        $setOnInsert: {
          matchesCount: 0,
          connectionsCount: 0,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: "Buddy profile saved successfully!",
      data: { profileId: result.upsertedId || userId },
    });
  } catch (error: any) {
    console.error("Error saving buddy profile:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save profile" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/buddy-match?userId=xxx
 * Find buddy matches for a user
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
    const buddyProfilesCollection = db.collection<BuddyProfile>("buddyProfiles");
    const buddyMatchesCollection = db.collection<BuddyMatch>("buddyMatches");
    const userProfilesCollection = db.collection("userProfiles");

    // Get user's profile
    const userProfile = await buddyProfilesCollection.findOne({ userId });

    if (!userProfile) {
      return NextResponse.json(
        { success: false, error: "Buddy profile not found. Create one first." },
        { status: 404 }
      );
    }

    // Find potential matches
    const potentialMatches = await buddyProfilesCollection
      .find({
        userId: { $ne: userId },
        visible: true,
        regularRoutes: { $in: userProfile.regularRoutes },
      })
      .toArray();

    // Calculate match scores
    const matches = await Promise.all(
      potentialMatches.map(async (match) => {
        // Calculate common routes
        const commonRoutes = userProfile.regularRoutes.filter((route) =>
          match.regularRoutes.includes(route)
        );

        // Calculate schedule overlap
        const commonDays = userProfile.commuteSchedule.days.filter((day) =>
          match.commuteSchedule.days.includes(day)
        );

        // Calculate match score (0-100)
        let matchScore = 0;
        matchScore += (commonRoutes.length / userProfile.regularRoutes.length) * 50;
        matchScore += (commonDays.length / 7) * 30;
        
        // Interest overlap
        if (userProfile.interests && match.interests) {
          const commonInterests = userProfile.interests.filter((interest) =>
            match.interests?.includes(interest)
          );
          matchScore += (commonInterests.length / Math.max(userProfile.interests.length, 1)) * 20;
        }

        matchScore = Math.round(matchScore);

        // Get user details
        const matchUserProfile = await userProfilesCollection.findOne({ userId: match.userId });

        return {
          matchId: match._id,
          userId: match.userId,
          matchScore,
          commonRoutes,
          commuteSchedule: match.commuteSchedule,
          interests: match.interests,
          travelKarma: matchUserProfile?.travelKarma || 0,
          verified: matchUserProfile?.badges?.includes('verified') || false,
        };
      })
    );

    // Sort by match score
    matches.sort((a, b) => b.matchScore - a.matchScore);

    // Save match suggestions
    const matchRecords = matches.slice(0, 10).map((match) => ({
      user1Id: userId,
      user2Id: match.userId,
      matchScore: match.matchScore,
      commonRoutes: match.commonRoutes,
      matchReason: `${match.commonRoutes.length} common routes, ${match.matchScore}% compatibility`,
      status: 'suggested',
      createdAt: new Date(),
    }));

    if (matchRecords.length > 0) {
      await buddyMatchesCollection.insertMany(matchRecords as any);
    }

    return NextResponse.json({
      success: true,
      data: matches.slice(0, 10), // Return top 10 matches
    });
  } catch (error: any) {
    console.error("Error finding buddy matches:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to find matches" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/buddy-match/connect
 * Connect with a buddy
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, buddyId, action } = body;

    if (!userId || !buddyId || !action) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const buddyMatchesCollection = db.collection<BuddyMatch>("buddyMatches");
    const buddyProfilesCollection = db.collection<BuddyProfile>("buddyProfiles");
    const karmaCollection = db.collection("karmaTransactions");
    const notificationsCollection = db.collection("notifications");

    if (action === 'connect') {
      // Update match status
      await buddyMatchesCollection.updateOne(
        { user1Id: userId, user2Id: buddyId },
        {
          $set: {
            status: 'connected',
            connectedAt: new Date(),
          },
        }
      );

      // Update connection counts
      await buddyProfilesCollection.updateMany(
        { userId: { $in: [userId, buddyId] } },
        { $inc: { connectionsCount: 1 } }
      );

      // Award karma
      await karmaCollection.insertOne({
        userId,
        action: 'carpool_offer',
        points: 25,
        description: "Connected with a bus buddy",
        metadata: { buddyId },
        createdAt: new Date(),
      });

      await db.collection("userProfiles").updateOne(
        { userId },
        { $inc: { travelKarma: 25 } }
      );

      // Notify buddy
      await notificationsCollection.insertOne({
        userId: buddyId,
        type: 'buddy_match',
        title: '🎉 New Buddy Connection!',
        message: `Someone wants to connect with you as a travel buddy`,
        actionUrl: `/buddy-match`,
        actionLabel: 'View Profile',
        read: false,
        channels: ['push'],
        createdAt: new Date(),
      });

      return NextResponse.json({
        success: true,
        message: "Connected successfully! +25 karma",
      });
    } else if (action === 'decline') {
      await buddyMatchesCollection.updateOne(
        { user1Id: userId, user2Id: buddyId },
        { $set: { status: 'declined' } }
      );

      return NextResponse.json({
        success: true,
        message: "Match declined",
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    console.error("Error connecting with buddy:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to connect" },
      { status: 500 }
    );
  }
}
