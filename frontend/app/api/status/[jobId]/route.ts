import { NextRequest, NextResponse } from "next/server";
import { renderFetch } from "@/lib/render-api";

// Next.js 15: params is a Promise
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  let upstream: Response;
  try {
    upstream = await renderFetch(`/pipeline/${jobId}/status`);
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 504 });
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    data = { error: `Backend error (${upstream.status})` };
  }
  return NextResponse.json(data, { status: upstream.status });
}
