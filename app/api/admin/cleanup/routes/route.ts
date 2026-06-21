import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// One-time cleanup: Delete all dummy routes except the real one
export async function POST() {
  try {
    const db = await getDatabase();
    const routesCollection = db.collection("routes");

    // The real route to keep
    const realRouteId = new ObjectId("6a37f7fed8e91a812a75a2c0");

    // Delete everything EXCEPT the real route
    const result = await routesCollection.deleteMany({
      _id: { $ne: realRouteId },
    });

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} dummy route(s). Kept route THR-THRISS-9408.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      { error: error.message || "Cleanup failed" },
      { status: 500 }
    );
  }
}
