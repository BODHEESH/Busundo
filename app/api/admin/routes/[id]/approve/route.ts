import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession, isAdmin } from "@/lib/auth";

// Points rules (agreed defaults; adjust in one place)
const POINTS_PER_ROUTE = 50;
const POINTS_PER_NEW_STOP = 10;
const DAILY_POINTS_CAP = 100;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const session = await getSession();
  const reviewerId = (session!.user as any).id as string;

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid route id" }, { status: 400 });
    }

    const db = await getDatabase();
    const routes = db.collection("routes");
    const route = await routes.findOne({ _id: new ObjectId(id) });

    if (!route) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    // Idempotent: approving twice never awards points twice
    if (route.verified === true) {
      return NextResponse.json({
        success: true,
        message: "Route was already approved",
        pointsAwarded: 0,
      });
    }

    let pointsAwarded = 0;
    const submitterId = route.submittedBy as string | undefined;
    const hasRealSubmitter = !!submitterId && /^[a-f0-9]{24}$/.test(submitterId);

    if (hasRealSubmitter) {
      const raw = POINTS_PER_ROUTE + POINTS_PER_NEW_STOP * (route.newStopCount || 0);

      // Daily cap per contributor, counted from today's karma transactions
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const [today] = await db
        .collection("karmaTransactions")
        .aggregate([
          {
            $match: {
              userId: submitterId,
              action: "contribute_route",
              createdAt: { $gte: startOfDay },
            },
          },
          { $group: { _id: null, total: { $sum: "$points" } } },
        ])
        .toArray();

      const earnedToday = today?.total || 0;
      pointsAwarded = Math.max(0, Math.min(raw, DAILY_POINTS_CAP - earnedToday));
    }

    await routes.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          verified: true,
          status: "approved",
          verifiedAt: new Date(),
          verifiedBy: reviewerId,
          pointsAwarded: pointsAwarded > 0,
        },
      }
    );

    if (pointsAwarded > 0 && submitterId) {
      await db.collection("karmaTransactions").insertOne({
        userId: submitterId,
        action: "contribute_route",
        points: pointsAwarded,
        description: `Route approved: ${route.routeName}`,
        metadata: {
          routeId: route.routeId,
          newStops: route.newStopCount || 0,
        },
        createdAt: new Date(),
      });

      await db
        .collection("userProfiles")
        .updateOne(
          { userId: submitterId },
          { $inc: { travelKarma: pointsAwarded } },
          { upsert: true }
        );
    }

    return NextResponse.json({
      success: true,
      message: "Route approved",
      pointsAwarded,
    });
  } catch (error: any) {
    console.error("Approve route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve route" },
      { status: 500 }
    );
  }
}
