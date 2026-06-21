import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// One-time fix: Convert route stops from IDs to names
export async function POST() {
  try {
    const db = await getDatabase();
    const routesCollection = db.collection("routes");
    const stopsCollection = db.collection("stops");

    // Find routes with stops stored as IDs (look like ObjectId hex strings)
    const routes = await routesCollection.find({}).toArray();
    let fixed = 0;

    for (const route of routes) {
      if (!Array.isArray(route.stops) || route.stops.length === 0) continue;

      // Check if first stop looks like an ObjectId (24 hex chars)
      const firstStop = route.stops[0];
      if (typeof firstStop === "string" && /^[0-9a-f]{24}$/i.test(firstStop)) {
        // Fetch stop names by IDs
        const stopNames: string[] = [];
        for (const stopId of route.stops) {
          try {
            const stop = await stopsCollection.findOne({
              _id: new ObjectId(stopId),
            });
            if (stop) {
              stopNames.push(stop.stopName);
            }
          } catch {
            // ignore
          }
        }

        // Update route with stop names
        await routesCollection.updateOne(
          { _id: route._id },
          { $set: { stops: stopNames, stopsCount: stopNames.length } }
        );
        fixed++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixed} route(s) — stops now stored as names.`,
      fixed,
    });
  } catch (error: any) {
    console.error("Fix route stops error:", error);
    return NextResponse.json(
      { error: error.message || "Fix failed" },
      { status: 500 }
    );
  }
}
