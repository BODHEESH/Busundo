import { NextResponse } from "next/server";
import { createRidePool, searchRidePools } from "@/lib/pool-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { route, departureTime, days, seatsAvailable, costPerPerson, vehicleType, description } = body;

    if (!route?.from || !route?.to || !departureTime || !days || !seatsAvailable || !costPerPerson || !vehicleType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const poolId = await createRidePool({
      createdBy: TEMP_USER_ID,
      route,
      departureTime,
      days,
      seatsAvailable,
      totalSeats: seatsAvailable,
      costPerPerson: parseFloat(costPerPerson),
      vehicleType,
      description,
    });

    return NextResponse.json({
      success: true,
      message: "Ride pool created successfully",
      poolId: poolId.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const day = searchParams.get("day") || undefined;
    const time = searchParams.get("time") || undefined;

    const pools = await searchRidePools(from, to, day, time);

    return NextResponse.json({
      pools: pools.map(p => ({
        _id: p._id?.toString(),
        createdBy: p.createdBy.toString(),
        route: p.route,
        departureTime: p.departureTime,
        days: p.days,
        seatsAvailable: p.seatsAvailable,
        totalSeats: p.totalSeats,
        costPerPerson: p.costPerPerson,
        vehicleType: p.vehicleType,
        description: p.description,
        membersCount: p.members.length,
        status: p.status,
        createdAt: p.createdAt,
      })),
      total: pools.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
