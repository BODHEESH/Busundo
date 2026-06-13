import { NextResponse } from "next/server";
import { getRoutesCollectionV2 } from "@/lib/models-v2";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const routes = await getRoutesCollectionV2();
    const route = await routes.findOne({ routeId: id });

    if (!route) {
      return NextResponse.json(
        { error: "Route not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      _id: route._id?.toString(),
      routeId: route.routeId,
      routeName: route.routeName,
      district: route.district,
      stops: route.stops,
      verified: route.verified,
      verifiedBy: route.verifiedBy.length,
      createdAt: route.createdAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
