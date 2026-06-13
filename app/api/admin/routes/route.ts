import { NextResponse } from "next/server";
import { bulkCreateRoute, getRoutesCollectionV2 } from "@/lib/models-v2";
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
    const routes = await getRoutesCollectionV2();
    const allRoutes = await routes.find({}).sort({ routeId: 1 }).toArray();
    
    return NextResponse.json({
      routes: allRoutes.map(r => ({
        _id: r._id?.toString(),
        routeId: r.routeId,
        routeName: r.routeName,
        district: r.district,
        stopsCount: r.stops.length,
        verified: r.verified,
        verifiedBy: r.verifiedBy.length,
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
