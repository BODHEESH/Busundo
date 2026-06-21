import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// One-time cleanup: Drop old routesV2 collection (all dummy data)
export async function POST() {
  try {
    const db = await getDatabase();
    const routesV2 = db.collection("routesV2");

    // Delete all documents from routesV2
    const result = await routesV2.deleteMany({});

    return NextResponse.json({
      success: true,
      message: `Deleted ${result.deletedCount} dummy route(s) from routesV2 collection.`,
      deletedCount: result.deletedCount,
    });
  } catch (error: any) {
    console.error("Cleanup routesV2 error:", error);
    return NextResponse.json(
      { error: error.message || "Cleanup failed" },
      { status: 500 }
    );
  }
}
