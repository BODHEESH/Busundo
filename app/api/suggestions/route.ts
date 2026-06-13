import { NextResponse } from "next/server";
import { createSuggestion, getPendingSuggestionsList, approveSuggestion } from "@/lib/models-v2";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, routeId, stopName, district, taluk } = body;

    if (!type || !stopName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const suggestionId = await createSuggestion({
      type,
      routeId,
      stopName,
      district,
      taluk,
      userId: TEMP_USER_ID,
      status: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Suggestion submitted successfully",
      suggestionId: suggestionId.toString(),
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
    const suggestions = await getPendingSuggestionsList(100);

    return NextResponse.json({
      suggestions: suggestions.map(s => ({
        _id: s._id?.toString(),
        type: s.type,
        routeId: s.routeId,
        stopName: s.stopName,
        district: s.district,
        taluk: s.taluk,
        userId: s.userId.toString(),
        status: s.status,
        approvals: s.approvals.length,
        rejections: s.rejections.length,
        createdAt: s.createdAt,
      })),
      total: suggestions.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
