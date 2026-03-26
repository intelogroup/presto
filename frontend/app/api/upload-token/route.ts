import { createHmac, randomBytes } from "crypto";
import { NextResponse } from "next/server";

// Returns a 5-minute HMAC token the client uses to upload directly to Render,
// keeping the long-term API secret server-side only.
export async function GET() {
  const secret = process.env.RENDER_API_SECRET;
  const uploadUrl = process.env.RENDER_API_URL;

  if (!secret) return NextResponse.json({ error: "RENDER_API_SECRET is not set" }, { status: 500 });
  if (!uploadUrl) return NextResponse.json({ error: "RENDER_API_URL is not set" }, { status: 500 });

  const nonce = randomBytes(8).toString("hex");
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
  const payload = `${expiresAt}:${nonce}`;
  const sig = createHmac("sha256", secret).update(payload).digest("hex");
  const token = `${payload}:${sig}`;

  return NextResponse.json({ token, uploadUrl, expiresAt });
}
