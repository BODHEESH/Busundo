import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";
import { formatTimingLines } from "@/lib/timings";

/** GET: pending route submissions waiting for admin review */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const db = await getDatabase();
    const pending = await db
      .collection("routes")
      .find({ status: "pending" })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json({
      routes: pending.map((r) => ({
        id: r._id.toString(),
        routeId: r.routeId,
        routeName: r.routeName,
        district: r.district,
        stops: r.stops || [],
        newStopCount: r.newStopCount || 0,
        submittedBy: r.submittedBy,
        createdAt: r.createdAt,
        timingsText: formatTimingLines(r.timings),
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
