import { NextResponse } from "next/server";
import { findDirectRoutes, findOneChangeRoutes } from "@/lib/models-v2";
import { upcomingDepartures } from "@/lib/timings";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    
    if (!from || !to) {
      return NextResponse.json(
        { error: "Missing 'from' or 'to' parameter" },
        { status: 400 }
      );
    }
    
    // Find direct routes
    const directRoutes = await findDirectRoutes(from, to);
    
    // Find one-change routes if no direct routes found
    let oneChangeRoutes: Awaited<ReturnType<typeof findOneChangeRoutes>> = [];
    if (directRoutes.length === 0) {
      oneChangeRoutes = await findOneChangeRoutes(from, to);
    }
    
    return NextResponse.json({
      from,
      to,
      directRoutes: directRoutes.map(r => ({
        // Next departures from the origin stop (IST), soonest first
        nextDepartures: upcomingDepartures((r.route as any).timings),
        timingsCount: Array.isArray((r.route as any).timings)
          ? (r.route as any).timings.length
          : 0,
        originStop: r.route.stops[0],
        routeId: r.route.routeId,
        routeName: r.route.routeName,
        boardAt: r.boardAt,
        dropAt: r.dropAt,
        stopsInBetween: r.stopsInBetween,
        journeyStops: r.journeyStops,
        verified: r.route.verified,
        verifiedBy: r.route.verifiedBy.length,
        isReturn: r.isReturn,
      })),
      oneChangeRoutes: oneChangeRoutes.map(r => ({
        route1: {
          routeId: r.route1.routeId,
          routeName: r.route1.routeName,
        },
        route2: {
          routeId: r.route2.routeId,
          routeName: r.route2.routeName,
        },
        boardAt: r.boardAt,
        changeAt: r.changeAt,
        dropAt: r.dropAt,
      })),
      hasDirectRoute: directRoutes.length > 0,
      requiresChange: directRoutes.length === 0 && oneChangeRoutes.length > 0,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
