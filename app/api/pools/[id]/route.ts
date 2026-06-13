import { NextResponse } from "next/server";
import { getPoolById, getPoolMembers } from "@/lib/pool-models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pool = await getPoolById(id);

    if (!pool) {
      return NextResponse.json(
        { error: "Pool not found" },
        { status: 404 }
      );
    }

    const members = await getPoolMembers(id);

    return NextResponse.json({
      _id: pool._id?.toString(),
      createdBy: pool.createdBy.toString(),
      route: pool.route,
      departureTime: pool.departureTime,
      days: pool.days,
      seatsAvailable: pool.seatsAvailable,
      totalSeats: pool.totalSeats,
      costPerPerson: pool.costPerPerson,
      vehicleType: pool.vehicleType,
      description: pool.description,
      members: members.map(m => ({
        userId: m.userId.toString(),
        joinedAt: m.joinedAt,
      })),
      membersCount: pool.members.length,
      status: pool.status,
      createdAt: pool.createdAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
