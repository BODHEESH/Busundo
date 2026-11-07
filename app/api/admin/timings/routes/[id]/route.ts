import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession, isAdmin } from "@/lib/auth";
import { parseTimingLines } from "@/lib/timings";

/** PUT: admin replaces the timings of a live route. Recorded for audit. */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const session = await getSession();
  const adminId = (session!.user as any).id as string;

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid route id" }, { status: 400 });
    }

    const body = await request.json();
    const parsed = parseTimingLines(typeof body.timingsText === "string" ? body.timingsText : "");
    if (parsed.errors.length) {
      return NextResponse.json({ error: parsed.errors[0], errors: parsed.errors }, { status: 400 });
    }

    const db = await getDatabase();
    const routes = db.collection("routes");
    const before = await routes.findOne({ _id: new ObjectId(id) });
    if (!before || before.status === "pending" || before.status === "rejected") {
      return NextResponse.json({ error: "Live route not found" }, { status: 404 });
    }

    const now = new Date();
    await routes.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          timings: parsed.timings,
          timingsUpdatedAt: now,
          timingsUpdatedBy: adminId,
        },
      }
    );

    // Audit trail: what changed, by whom, and the previous value
    await db.collection("adminAuditLog").insertOne({
      action: "timings_updated",
      targetId: id,
      routeId: before.routeId,
      adminId,
      before: before.timings || [],
      after: parsed.timings,
      createdAt: now,
    });

    return NextResponse.json({ success: true, timingsSaved: parsed.timings.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
