import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { formatTimingLines } from "@/lib/timings";

/** GET: routes that are live (approved or seeded), with their timings */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const db = await getDatabase();
    const live = await db
      .collection("routes")
      .find({ status: { $nin: ["pending", "rejected"] } })
      .sort({ routeName: 1 })
      .limit(300)
      .toArray();

    return NextResponse.json({
      routes: live.map((r) => ({
        id: r._id.toString(),
        routeId: r.routeId,
        routeName: r.routeName,
        district: r.district,
        originStop: Array.isArray(r.stops) ? r.stops[0] : "",
        timingsText: formatTimingLines(r.timings),
        timingsUpdatedAt: r.timingsUpdatedAt || null,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
