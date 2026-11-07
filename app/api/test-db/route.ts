import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";
import { isAdmin } from "@/lib/auth";

// Diagnostic endpoint. Hidden in production and admin-only elsewhere,
// because it lists database collection names.
export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("test-db error:", error?.message || error);
    return NextResponse.json(
      { success: false, message: "Database connection failed" },
      { status: 500 }
    );
  }
}
