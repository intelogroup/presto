import { NextRequest, NextResponse } from "next/server";
import { renderFetch } from "@/lib/render-api";

// Explicit Node.js runtime required — streaming upstream.body is incompatible with edge runtime
export const runtime = "nodejs";

// Next.js 15: params is a Promise
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  let upstream: Response;
  try {
    upstream = await renderFetch(`/pipeline/${jobId}/download`);
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 504 });
  }

  if (!upstream.ok) {
    let data: unknown;
    try {
      data = await upstream.json();
    } catch {
      data = { error: `Backend error (${upstream.status})` };
    }
    return NextResponse.json(data, { status: upstream.status });
  }

  const contentDisposition =
    upstream.headers.get("content-disposition") ??
    `attachment; filename="${jobId}.mp4"`;

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      "content-type": "video/mp4",
      "content-disposition": contentDisposition,
    },
  });
}
