import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verified = searchParams.get("verified");

    const db = await getDatabase();
    const stopsCollection = db.collection("stops");

    // Build query
    const query: any = {};
    if (verified === "true") {
      query.verified = true;
    }

    const stops = await stopsCollection.find(query).toArray();

    return NextResponse.json({ stops });
  } catch (error: any) {
    console.error("Error fetching stops:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch stops" },
      { status: 500 }
    );
  }
}
