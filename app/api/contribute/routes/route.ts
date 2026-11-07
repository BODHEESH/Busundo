import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import { parseTimingLines } from "@/lib/timings";

// Max route submissions per user per 24 hours (anti-spam)
const DAILY_SUBMISSION_LIMIT = 20;

export async function POST(request: NextRequest) {
  // Login required: points can only be credited to a real account
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: "Please sign in to add a route" },
      { status: 401 }
    );
  }
  const submitterId = (session.user as any).id as string;

  try {
    const db0 = await getDatabase();
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await db0.collection("routes").countDocuments({
      submittedBy: submitterId,
      createdAt: { $gte: since },
    });
    if (recentCount >= DAILY_SUBMISSION_LIMIT) {
      return NextResponse.json(
        { error: "Daily submission limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { routeName, district, stops, timingsText } = body;

    // Optional departure times, one per line (e.g. "08:30 daily")
    const timingParse = parseTimingLines(typeof timingsText === "string" ? timingsText : "");
    if (timingParse.errors.length) {
      return NextResponse.json(
        { error: timingParse.errors[0], errors: timingParse.errors },
        { status: 400 }
      );
    }

    if (!routeName || !district || !stops) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const routesCollection = db.collection("routes");
    const stopsCollection = db.collection("stops");

    // Auto-generate route ID: DISTRICT-ROUTENAME-XXXX
    const districtPrefix = district.substring(0, 3).toUpperCase();
    const nameSlug = routeName
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "")
      .substring(0, 6);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const routeId = `${districtPrefix}-${nameSlug}-${randomSuffix}`;

    // Parse stops
    const stopNames = stops
      .split("\n")
      .map((s: string) => s.trim())
      .filter((s: string) => s);

    if (stopNames.length === 0) {
      return NextResponse.json(
        { error: "At least one stop is required" },
        { status: 400 }
      );
    }

    // Process stops - create missing ones
    const createdStopNames: string[] = [];
    let newStopCount = 0;
    for (const stopName of stopNames) {
      let stop = await stopsCollection.findOne({ stopName });

      if (!stop) {
        // Create new stop with verified: false (pending admin approval)
        const newStop = {
          stopName,
          district,
          taluk: "Unknown", // User doesn't provide taluk
          verified: false,
          verifiedBy: 0,
          createdAt: new Date(),
        };
        await stopsCollection.insertOne(newStop);
        newStopCount++;
      }
      createdStopNames.push(stopName);
    }

    // Create route with verified: false (pending admin approval)
    const newRoute = {
      routeId,
      routeName,
      district,
      stops: createdStopNames,
      stopsCount: createdStopNames.length,
      verified: false,
      verifiedBy: 0,
      createdAt: new Date(),
      submittedBy: submitterId,
      status: "pending", // public only after admin approval
      newStopCount,
      timings: timingParse.timings,
      pointsAwarded: false,
    };

    await routesCollection.insertOne(newRoute);

    return NextResponse.json({
      message: "Route submitted successfully! Pending admin approval.",
      routeId,
    });
  } catch (error: any) {
    console.error("Error submitting route:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit route" },
      { status: 500 }
    );
  }
}
