import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Comprehensive cleanup: Remove ALL dummy data from all collections
export async function POST() {
  const results: Record<string, number> = {};

  try {
    const db = await getDatabase();

    // 1. Routes: delete old-schema dummy routes (have `code` field like PB001, PB008, etc.)
    const routesCollection = db.collection("routes");
    const oldSchemaRoutes = await routesCollection.deleteMany({ code: { $exists: true } });
    results.routes_old_schema_deleted = oldSchemaRoutes.deletedCount;

    // 2. Stops: delete auto-created dummy stops (taluk: "Unknown")
    const stopsCollection = db.collection("stops");
    const dummyStops = await stopsCollection.deleteMany({ taluk: "Unknown" });
    results.stops_dummy_deleted = dummyStops.deletedCount;

    // 3. Clear entire collections that only hold dummy/community data
    const collectionsToClear = [
      "routesV2",
      "busStops",
      "groups",
      "groupMembers",
      "notifications",
      "pendingSuggestions",
    ];

    for (const colName of collectionsToClear) {
      try {
        const collection = db.collection(colName);
        const result = await collection.deleteMany({});
        results[colName + "_cleared"] = result.deletedCount;
      } catch (e: any) {
        results[colName + "_error"] = -1;
      }
    }

    return NextResponse.json({
      success: true,
      message: "Cleanup complete. Dummy data removed.",
      summary: results,
    });
  } catch (error: any) {
    console.error("Cleanup error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Cleanup failed",
        partialResults: results,
      },
      { status: 500 }
    );
  }
}
