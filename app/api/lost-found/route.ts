import { NextRequest, NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { LostFoundItem, KarmaTransaction } from "@/lib/database-schemas";
import { ObjectId } from "mongodb";

/**
 * POST /api/lost-found
 * Create a new lost or found item report
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      itemName,
      description,
      category,
      routeId,
      location,
      busNumber,
      contactName,
      contactPhone,
      contactEmail,
      imageUrls,
    } = body;

    // Validation
    if (!userId || !type || !itemName || !description || !category || !routeId || !location || !contactName) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!['lost', 'found'].includes(type)) {
      return NextResponse.json(
        { success: false, error: "Type must be 'lost' or 'found'" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const lostFoundCollection = db.collection<LostFoundItem>("lostFoundItems");
    const karmaCollection = db.collection<KarmaTransaction>("karmaTransactions");

    // Create lost/found item
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // Expire after 30 days

    const item: Omit<LostFoundItem, '_id'> = {
      type,
      userId,
      itemName,
      description,
      category,
      imageUrls: imageUrls || [],
      routeId,
      location,
      busNumber,
      contactName,
      contactPhone,
      contactEmail,
      status: 'active',
      views: 0,
      commentsCount: 0,
      sharesCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt,
    };

    const result = await lostFoundCollection.insertOne(item as any);

    // Award karma points
    const karmaPoints = 20;
    await karmaCollection.insertOne({
      userId,
      action: 'lost_found_help',
      points: karmaPoints,
      description: `Posted ${type} item: ${itemName}`,
      metadata: { itemId: result.insertedId.toString(), type },
      createdAt: new Date(),
    } as any);

    // Update user karma
    await db.collection("userProfiles").updateOne(
      { userId },
      { $inc: { travelKarma: karmaPoints } }
    );

    return NextResponse.json({
      success: true,
      message: `${type === 'lost' ? 'Lost' : 'Found'} item reported successfully!`,
      data: {
        itemId: result.insertedId,
        karmaEarned: karmaPoints,
      },
    });
  } catch (error: any) {
    console.error("Error creating lost/found item:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create item" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/lost-found?type=lost&routeId=xxx&category=bag
 * Get lost/found items with filters
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type");
    const routeId = searchParams.get("routeId");
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "active";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const db = await getDatabase();
    const lostFoundCollection = db.collection<LostFoundItem>("lostFoundItems");

    // Build query
    const query: any = { status };
    if (type) query.type = type;
    if (routeId) query.routeId = routeId;
    if (category) query.category = category;

    // Get total count
    const total = await lostFoundCollection.countDocuments(query);

    // Get items
    const items = await lostFoundCollection
      .find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    return NextResponse.json({
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching lost/found items:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch items" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/lost-found/:id
 * Update item status (resolve, etc.)
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, status, resolvedBy } = body;

    if (!itemId || !status) {
      return NextResponse.json(
        { success: false, error: "itemId and status are required" },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const lostFoundCollection = db.collection<LostFoundItem>("lostFoundItems");
    const karmaCollection = db.collection<KarmaTransaction>("karmaTransactions");

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'resolved') {
      updateData.resolvedAt = new Date();
      if (resolvedBy) updateData.resolvedBy = resolvedBy;

      // Award bonus karma for successful resolution
      const item = await lostFoundCollection.findOne({ _id: new ObjectId(itemId) });
      if (item && resolvedBy) {
        const bonusKarma = 30;
        await karmaCollection.insertOne({
          userId: resolvedBy,
          action: 'lost_found_help',
          points: bonusKarma,
          description: `Helped resolve ${item.type} item: ${item.itemName}`,
          metadata: { itemId },
          createdAt: new Date(),
        } as any);

        await db.collection("userProfiles").updateOne(
          { userId: resolvedBy },
          { $inc: { travelKarma: bonusKarma } }
        );
      }
    }

    await lostFoundCollection.updateOne(
      { _id: new ObjectId(itemId) },
      { $set: updateData }
    );

    return NextResponse.json({
      success: true,
      message: "Item updated successfully!",
    });
  } catch (error: any) {
    console.error("Error updating lost/found item:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update item" },
      { status: 500 }
    );
  }
}
