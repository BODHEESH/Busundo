import { NextResponse } from "next/server";
import { createBusStop, getBusStopsCollection } from "@/lib/models-v2";
import { ObjectId } from "mongodb";

// Temporary admin user ID (replace with actual auth later)
const ADMIN_USER_ID = new ObjectId();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stopName, district, taluk, latitude, longitude, aliases } = body;
    
    if (!stopName || !district || !taluk) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    const id = await createBusStop({
      stopName,
      district,
      taluk,
      latitude: latitude ? parseFloat(latitude) : undefined,
      longitude: longitude ? parseFloat(longitude) : undefined,
      aliases: aliases || [],
      verified: false,
      verifiedBy: [],
      createdBy: ADMIN_USER_ID,
    });
    
    return NextResponse.json({
      success: true,
      message: `Stop "${stopName}" created successfully`,
      stopId: id.toString(),
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
    const stops = await getBusStopsCollection();
    const allStops = await stops.find({}).sort({ stopName: 1 }).toArray();
    
    return NextResponse.json({
      stops: allStops.map(s => ({
        _id: s._id?.toString(),
        stopName: s.stopName,
        district: s.district,
        taluk: s.taluk,
        verified: s.verified,
        verifiedBy: s.verifiedBy.length,
      })),
      total: allStops.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
