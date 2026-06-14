import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { routeId, routeName, district, stops } = body;

    if (!routeId || !routeName || !district || !stops) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const routesCollection = db.collection("routes");
    const stopsCollection = db.collection("stops");

    // Check if route already exists
    const existingRoute = await routesCollection.findOne({ routeId });
    if (existingRoute) {
      return NextResponse.json(
        { error: "Route ID already exists" },
        { status: 400 }
      );
    }

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
    const stopIds: string[] = [];
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
        const result = await stopsCollection.insertOne(newStop);
        stopIds.push(result.insertedId.toString());
      } else {
        stopIds.push(stop._id.toString());
      }
    }

    // Create route with verified: false (pending admin approval)
    const newRoute = {
      routeId,
      routeName,
      district,
      stops: stopIds,
      stopsCount: stopIds.length,
      verified: false,
      verifiedBy: 0,
      createdAt: new Date(),
      submittedBy: "user", // In future, add actual user ID
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
