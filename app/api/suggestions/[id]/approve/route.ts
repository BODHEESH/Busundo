import { NextResponse } from "next/server";
import { approveSuggestion } from "@/lib/models-v2";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    await approveSuggestion(id, TEMP_USER_ID);

    return NextResponse.json({
      success: true,
      message: "Suggestion approved",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
