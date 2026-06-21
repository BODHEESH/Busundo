import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { routeName, district, stops } = body;

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
