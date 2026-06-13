import { NextResponse } from "next/server";
import { createCommunityPost } from "@/lib/community-models";
import { ObjectId } from "mongodb";

// Temporary user ID (replace with actual auth later)
const TEMP_USER_ID = new ObjectId();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, title, content } = body;

    if (!type || !title || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const postId = await createCommunityPost({
      communityId: new ObjectId(id),
      userId: TEMP_USER_ID,
      type,
      title,
      content,
    });

    return NextResponse.json({
      success: true,
      message: "Post created successfully",
      postId: postId.toString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
