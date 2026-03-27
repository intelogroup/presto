"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusTracker } from "@/components/status-tracker";
import { SlideStrip } from "@/components/slide-strip";
import { ChatEditor } from "@/components/chat-editor";

interface JobStatus {
  jobId: string;
  status: string;
  step: string;
  error?: string;
}

// Mock slides for the "ready" state
const MOCK_SLIDES = [
  { index: 1, type: "Title", durationSec: 4 },
  { index: 2, type: "Content", durationSec: 8 },
  { index: 3, type: "Chart", durationSec: 6 },
  { index: 4, type: "Content", durationSec: 10 },
  { index: 5, type: "Summary", durationSec: 5 },
];

export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = use(params);
  const [job, setJob] = useState<JobStatus | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const res = await fetch(`/api/status/${jobId}`);
        const data = (await res.json()) as Partial<JobStatus> & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Status check failed");
        const status = data.status === "ready" ? "done" : data.status === "failed" ? "error" : data.status;
        if (!status) throw new Error("Malformed status response");
        setJob({ ...(data as JobStatus), status });
        setFetchError(null);
        if (status !== "done" && status !== "error") {
          timeout = setTimeout(poll, 2000);
        }
      } catch {
        setFetchError("Lost connection — retrying...");
        timeout = setTimeout(poll, 4000);
      }
    }

    poll();
    return () => clearTimeout(timeout);
  }, [jobId]);

  const isDone = job?.status === "done";
  const isError = job?.status === "error";

  // Processing state
  if (!isDone && !isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-xl font-semibold text-foreground">Processing...</h1>
        <p className="mt-1 text-xs text-muted-foreground/70 font-mono">
          {jobId}
        </p>

        <div className="mt-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          {job ? (
            <StatusTracker
              step={job.step}
              status={job.status}
              error={job.error}
            />
          ) : fetchError ? (
            <p className="text-sm text-muted-foreground">{fetchError}</p>
          ) : (
            <p className="text-sm text-muted-foreground/70">Connecting...</p>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Usually takes 2-5 minutes
        </p>

        <div className="mt-6 text-center">
          <Link href="/app">
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Failed state
  if (isError) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <h1 className="text-xl font-semibold text-foreground">Failed</h1>
        <p className="mt-1 text-xs text-muted-foreground/70 font-mono">
          {jobId}
        </p>

        <div className="mt-6 rounded-lg bg-destructive/10 p-4">
          <p className="text-sm text-destructive">
            {job?.error ?? "An unexpected error occurred."}
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <Link href="/app/new">
            <Button>Try Again</Button>
          </Link>
          <Link href="/app">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Ready state — two-panel layout
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left panel (video + slides + actions) */}
        <div className="flex-1 space-y-4 lg:w-3/5">
          {/* Video player */}
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-black flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="size-16 text-white/30"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
              />
            </svg>
          </div>

          {/* Slide strip */}
          <SlideStrip slides={MOCK_SLIDES} />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <a href={`/api/download/${jobId}`} download>
              <Button>Download MP4</Button>
            </a>
            <Link href="/app/new">
              <Button variant="outline">Create Another</Button>
            </Link>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span>Theme: Dark Tech</span>
            <span>Duration: 33s</span>
            <span>5 slides</span>
            <span>Created: just now</span>
          </div>
        </div>

        {/* Right panel (chat editor) */}
        <div className="lg:w-2/5 lg:min-h-[500px]">
          <ChatEditor jobId={jobId} />
        </div>
      </div>
    </div>
  );
}
