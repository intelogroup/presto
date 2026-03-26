import { NextRequest, NextResponse } from "next/server";
import { renderFetch } from "@/lib/render-api";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  let upstream: Response;
  try {
    upstream = await renderFetch("/pipeline/start", {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    const msg = err instanceof Error && err.name === "AbortError"
      ? "Backend is warming up — please retry in a moment"
      : "Failed to reach backend";
    return NextResponse.json({ error: msg }, { status: 504 });
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    data = { error: `Backend error (${upstream.status})` };
  }
  return NextResponse.json(data, { status: upstream.status });
}
