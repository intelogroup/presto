import { NextResponse } from "next/server";

export async function POST() {
  // Stub: chat-based video editing is not yet wired to the backend.
  // Return a helpful message so the UI degrades gracefully.
  return NextResponse.json({
    reply:
      "Chat editing is coming soon! For now, re-generate your video from the dashboard to make changes.",
  });
}
