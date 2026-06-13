import { NextResponse } from "next/server";
import { joinCircle } from "@/lib/community-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { inviteCode } = body;

    await joinCircle(id, TEMP_USER_ID, inviteCode);

    return NextResponse.json({
      success: true,
      message: "Successfully joined the circle",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
