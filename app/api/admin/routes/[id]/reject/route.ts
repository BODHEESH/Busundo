import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { getSession, isAdmin } from "@/lib/auth";

/** POST: reject a pending route submission with a reason shown to the contributor */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }
  const session = await getSession();
  const reviewerId = (session!.user as any).id as string;

  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid route id" }, { status: 400 });
    }

    const body = await request.json();
    const reason = typeof body.reason === "string" ? body.reason.trim() : "";
    if (reason.length < 5) {
      return NextResponse.json(
        { error: "Please give a reason of at least 5 characters" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const result = await db.collection("routes").updateOne(
      { _id: new ObjectId(id), status: "pending" },
      {
        $set: {
          status: "rejected",
          rejectionReason: reason,
          rejectedBy: reviewerId,
          rejectedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Route not found or already reviewed" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Route rejected" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
