import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { bulkCreateRoute } from "@/lib/models-v2";
import { ObjectId } from "mongodb";

// Temporary admin user ID (replace with actual auth later)
const ADMIN_USER_ID = new ObjectId();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { routeId, routeName, district, stops } = body;
    
    if (!routeId || !routeName || !district || !stops) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Create route using bulk method
    const id = await bulkCreateRoute(
      routeId,
      routeName,
      district,
      stops,
      ADMIN_USER_ID
    );
    
    return NextResponse.json({
      success: true,
      message: `Route ${routeId} created successfully`,
      routeId: id.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await getDatabase();
    const routesCollection = db.collection("routes");
    // Only fetch documents with new schema (routeName exists)
    const allRoutes = await routesCollection
      .find({ routeName: { $exists: true } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      routes: allRoutes.map((r) => ({
        _id: r._id?.toString(),
        routeId: r.routeId || r.code || "N/A",
        routeName: r.routeName || `${r.source || ""}-${r.destination || ""}`,
        district: r.district || "Unknown",
        stopsCount: r.stopsCount || (Array.isArray(r.stops) ? r.stops.length : 0),
        verified: r.verified || false,
        verifiedBy: Array.isArray(r.verifiedBy) ? r.verifiedBy.length : (r.verifiedBy || 0),
      })),
      total: allRoutes.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
