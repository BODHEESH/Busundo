import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { isAdmin } from "@/lib/auth";
import { parseTimingLines } from "@/lib/timings";

/** PATCH: admin edits the timings on a pending route before approving it */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

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
    const timings = parsed.timings;

    const db = await getDatabase();
    const result = await db.collection("routes").updateOne(
      { _id: new ObjectId(id), status: "pending" },
      { $set: { timings, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Route not found or no longer pending" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, timingsSaved: timings.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
