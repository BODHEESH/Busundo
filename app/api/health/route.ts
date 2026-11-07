import { NextResponse } from "next/server";
import { getDatabase } from "@/lib/mongodb";

// Public health check for uptime monitors. Reveals no internal details.
export async function GET() {
  let database: "ok" | "down" = "ok";
  try {
    const db = await getDatabase();
    await db.command({ ping: 1 });
  } catch {
    database = "down";
  }

  const status = database === "ok" ? "ok" : "degraded";
  return NextResponse.json(
    { status, database, time: new Date().toISOString() },
    { status: database === "ok" ? 200 : 503 }
  );
}
