import { NextRequest, NextResponse } from "next/server";
import { isValidEmail, normalizeEmail, requestLoginCode } from "@/lib/otp";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    const result = await requestLoginCode(email);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    // Same response whether or not the email is registered
    return NextResponse.json({ success: true, message: "If that email is valid, a code is on its way." });
  } catch (error: any) {
    console.error("OTP request error:", error?.message || error);
    return NextResponse.json(
      { error: "Could not send the code. Please try again." },
      { status: 500 }
    );
  }
}
