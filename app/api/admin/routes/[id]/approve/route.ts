import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = await getDatabase();
    const routesCollection = db.collection("routes");

    const result = await routesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { verified: true, verifiedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Route not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Route approved" });
  } catch (error: any) {
    console.error("Approve route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to approve route" },
      { status: 500 }
    );
  }
}
