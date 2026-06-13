import { NextResponse } from "next/server";
import { verifyRoute } from "@/lib/models-v2";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // In production, get userId from session
    // const session = await getServerSession();
    // const userId = session.user.id;
    
    await verifyRoute(id, TEMP_USER_ID);

    return NextResponse.json({
      success: true,
      message: "Route verified successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
