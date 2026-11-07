/**
 * Email one-time sign-in codes.
 *
 * - 6-digit code, valid 10 minutes, 5 wrong attempts max
 * - Stored only as an HMAC hash (keyed with NEXTAUTH_SECRET)
 * - 60 second cooldown between requests, 5 requests per email per hour
 * - Codes are deleted after a successful sign-in
 */
import crypto from "crypto";
import nodemailer from "nodemailer";
import { getDatabase } from "@/lib/mongodb";

const CODE_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;
const MAX_REQUESTS_PER_HOUR = 5;

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isValidEmail(email: string): boolean {
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hashCode(email: string, code: string): string {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("NEXTAUTH_SECRET is not set");
  return crypto.createHmac("sha256", secret).update(`${email}:${code}`).digest("hex");
}

async function sendCodeEmail(to: string, code: string): Promise<void> {
  if (!process.env.SMTP_HOST) {
    if (process.env.NODE_ENV !== "production") {
      // Development only: no mail server configured, so print the code
      console.info(`[dev] sign-in code for ${to}: ${code}`);
      return;
    }
    throw new Error("Email sign-in is not configured on this server");
  }

  const port = Number(process.env.SMTP_PORT || 587);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: `Your Busundo sign-in code: ${code}`,
    text:
      `Your Busundo sign-in code is ${code}.\n\n` +
      `It expires in 10 minutes. If you did not ask for this code, you can ignore this email.`,
  });
}

export async function requestLoginCode(
  email: string
): Promise<{ ok: true } | { ok: false; status: number; error: string }> {
  const db = await getDatabase();
  const codes = db.collection("loginCodes");
  const now = Date.now();

  const last = await codes.findOne({ email }, { sort: { createdAt: -1 } });
  if (last && now - new Date(last.createdAt).getTime() < RESEND_COOLDOWN_MS) {
    return { ok: false, status: 429, error: "Please wait a minute before requesting another code" };
  }

  const recent = await codes.countDocuments({
    email,
    createdAt: { $gte: new Date(now - 60 * 60 * 1000) },
  });
  if (recent >= MAX_REQUESTS_PER_HOUR) {
    return { ok: false, status: 429, error: "Too many codes requested. Try again later." };
  }

  const code = crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

  await codes.insertOne({
    email,
    codeHash: hashCode(email, code),
    attempts: 0,
    createdAt: new Date(now),
    expiresAt: new Date(now + CODE_TTL_MS),
  });

  await sendCodeEmail(email, code);
  return { ok: true };
}

/** Returns true and clears the codes if the code is correct and in time. */
export async function verifyLoginCode(email: string, code: string): Promise<boolean> {
  if (!/^\d{6}$/.test(code)) return false;

  const db = await getDatabase();
  const codes = db.collection("loginCodes");
  const latest = await codes.findOne({ email }, { sort: { createdAt: -1 } });

  if (!latest) return false;
  if (new Date(latest.expiresAt).getTime() < Date.now()) return false;
  if (latest.attempts >= MAX_ATTEMPTS) return false;

  // Count the attempt before checking, so guessing is limited
  await codes.updateOne({ _id: latest._id }, { $inc: { attempts: 1 } });

  const expected = Buffer.from(latest.codeHash, "hex");
  const given = Buffer.from(hashCode(email, code), "hex");
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) {
    return false;
  }

  await codes.deleteMany({ email });
  return true;
}
