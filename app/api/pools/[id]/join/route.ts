import { NextResponse } from "next/server";
import { joinRidePool } from "@/lib/pool-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await joinRidePool(id, TEMP_USER_ID);

    return NextResponse.json({
      success: true,
      message: "Successfully joined the pool",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
