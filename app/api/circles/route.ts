import { NextResponse } from "next/server";
import { createTravelCircle, getPublicCircles, getUserCircles } from "@/lib/community-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, route, isPrivate } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const circleId = await createTravelCircle({
      name,
      description,
      route,
      isPrivate: isPrivate || false,
      createdBy: TEMP_USER_ID,
    });

    return NextResponse.json({
      success: true,
      message: "Travel circle created successfully",
      circleId: circleId.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const myCircles = searchParams.get("my") === "true";

    let circles;
    if (myCircles) {
      circles = await getUserCircles(TEMP_USER_ID);
    } else {
      circles = await getPublicCircles();
    }

    return NextResponse.json({
      circles: circles.map(c => ({
        _id: c._id?.toString(),
        name: c.name,
        description: c.description,
        route: c.route,
        membersCount: c.members.length,
        isPrivate: c.isPrivate,
        inviteCode: c.isPrivate ? c.inviteCode : undefined,
        createdAt: c.createdAt,
      })),
      total: circles.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
