import { NextResponse } from "next/server";
import { getCommunityById, getCommunityPosts } from "@/lib/community-models";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const community = await getCommunityById(id);

    if (!community) {
      return NextResponse.json(
        { error: "Community not found" },
        { status: 404 }
      );
    }

    const posts = await getCommunityPosts(id);

    return NextResponse.json({
      _id: community._id?.toString(),
      name: community.name,
      description: community.description,
      route: community.route,
      membersCount: community.members.length,
      moderators: community.moderators.map(m => m.toString()),
      createdBy: community.createdBy.toString(),
      createdAt: community.createdAt,
      posts: posts.map(p => ({
        _id: p._id?.toString(),
        userId: p.userId.toString(),
        type: p.type,
        title: p.title,
        content: p.content,
        upvotes: p.upvotes.length,
        comments: p.comments.length,
        createdAt: p.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
