import { NextResponse } from "next/server";
import { getCircleById, getCircleMembers } from "@/lib/community-models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const circle = await getCircleById(id);

    if (!circle) {
      return NextResponse.json(
        { error: "Circle not found" },
        { status: 404 }
      );
    }

    const members = await getCircleMembers(id);

    return NextResponse.json({
      _id: circle._id?.toString(),
      name: circle.name,
      description: circle.description,
      route: circle.route,
      membersCount: circle.members.length,
      isPrivate: circle.isPrivate,
      inviteCode: circle.isPrivate ? circle.inviteCode : undefined,
      admins: circle.admins.map(a => a.toString()),
      createdBy: circle.createdBy.toString(),
      createdAt: circle.createdAt,
      members: members.map(m => ({
        userId: m.userId.toString(),
        role: m.role,
        joinedAt: m.joinedAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
