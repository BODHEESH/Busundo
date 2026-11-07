import { NextResponse } from "next/server";
import { verifyRoute } from "@/lib/models-v2";
import { ObjectId } from "mongodb";
import { getSession, isAdmin } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Only admins can verify route data
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const session = await getSession();
    const reviewerId = new ObjectId((session!.user as any).id);

    await verifyRoute(id, reviewerId);

    return NextResponse.json({
      success: true,
      message: "Route verified successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
