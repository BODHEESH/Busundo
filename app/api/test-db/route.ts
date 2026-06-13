import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Test the connection by listing collections
    const collections = await db.listCollections().toArray();
    
    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      database: db.databaseName,
      collections: collections.map(c => c.name),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
