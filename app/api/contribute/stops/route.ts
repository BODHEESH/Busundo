import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { stopName, district, taluk, latitude, longitude, aliases } = body;

    if (!stopName || !district || !taluk) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const stopsCollection = db.collection("stops");

    // Check if stop already exists
    const existingStop = await stopsCollection.findOne({ stopName });
    if (existingStop) {
      return NextResponse.json(
        { error: "Stop already exists" },
        { status: 400 }
      );
    }

    // Create new stop with verified: false (pending admin approval)
    const newStop: any = {
      stopName,
      district,
      taluk,
      verified: false,
      verifiedBy: 0,
      createdAt: new Date(),
      submittedBy: "user", // In future, add actual user ID
    };

    // Add optional fields
    if (latitude) newStop.latitude = parseFloat(latitude);
    if (longitude) newStop.longitude = parseFloat(longitude);
    if (aliases) {
      newStop.aliases = aliases
        .split(",")
        .map((a: string) => a.trim())
        .filter((a: string) => a);
    }

    await stopsCollection.insertOne(newStop);

    return NextResponse.json({
      message: "Stop submitted successfully! Pending admin approval.",
      stopName,
    });
  } catch (error: any) {
    console.error("Error submitting stop:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit stop" },
      { status: 500 }
    );
  }
}
