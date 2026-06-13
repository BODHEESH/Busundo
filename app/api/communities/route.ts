import { NextResponse } from "next/server";
import { createCommunity, getAllCommunities } from "@/lib/community-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, route } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const communityId = await createCommunity({
      name,
      description,
      route,
      createdBy: TEMP_USER_ID,
    });

    return NextResponse.json({
      success: true,
      message: "Community created successfully",
      communityId: communityId.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const communities = await getAllCommunities();

    return NextResponse.json({
      communities: communities.map(c => ({
        _id: c._id?.toString(),
        name: c.name,
        description: c.description,
        route: c.route,
        membersCount: c.members.length,
        createdAt: c.createdAt,
      })),
      total: communities.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
