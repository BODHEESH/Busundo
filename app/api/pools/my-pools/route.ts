import { NextResponse } from "next/server";
import { getUserPools, getCreatedPools } from "@/lib/pool-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function GET() {
  try {
    const joinedPools = await getUserPools(TEMP_USER_ID);
    const createdPools = await getCreatedPools(TEMP_USER_ID);

    return NextResponse.json({
      joinedPools: joinedPools.map(p => ({
        _id: p._id?.toString(),
        route: p.route,
        departureTime: p.departureTime,
        days: p.days,
        seatsAvailable: p.seatsAvailable,
        totalSeats: p.totalSeats,
        costPerPerson: p.costPerPerson,
        vehicleType: p.vehicleType,
        membersCount: p.members.length,
        status: p.status,
        isCreator: p.createdBy.toString() === TEMP_USER_ID.toString(),
      })),
      createdPools: createdPools.map(p => ({
        _id: p._id?.toString(),
        route: p.route,
        departureTime: p.departureTime,
        days: p.days,
        seatsAvailable: p.seatsAvailable,
        totalSeats: p.totalSeats,
        costPerPerson: p.costPerPerson,
        vehicleType: p.vehicleType,
        membersCount: p.members.length,
        status: p.status,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
