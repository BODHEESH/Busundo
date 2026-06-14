import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const verified = searchParams.get("verified");

    const db = await getDatabase();
    const routesCollection = db.collection("routes");

    // Build query
    const query: any = {};
    if (verified === "true") {
      query.verified = true;
    }

    const routes = await routesCollection.find(query).toArray();

    return NextResponse.json({ routes });
  } catch (error: any) {
    console.error("Error fetching routes:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch routes" },
      { status: 500 }
    );
  }
}
