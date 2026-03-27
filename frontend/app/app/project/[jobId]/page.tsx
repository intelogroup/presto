"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { StatusTracker } from "@/components/status-tracker";
import { SlideStrip } from "@/components/slide-strip";
import { ChatEditor } from "@/components/chat-editor";
import { cn } from "@/lib/utils";

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

  // Processing state — centered card
  if (!isDone && !isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-lg space-y-6 animate-fade-up">
          <div className="text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/15 mb-4">
              <svg className="size-6 text-primary animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-foreground">Processing your video</h1>
            <p className="mt-1 text-xs text-muted-foreground/60 font-mono">{jobId}</p>
          </div>

          <div className="rounded-2xl border border-border/60 bg-card p-6">
            {job ? (
              <StatusTracker step={job.step} status={job.status} error={job.error} />
            ) : fetchError ? (
              <p className="text-sm text-muted-foreground">{fetchError}</p>
            ) : (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Connecting...
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground/50">Usually takes 2-5 minutes</p>

          <div className="text-center">
            <Link href="/app">
              <Button variant="ghost" size="sm">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Failed state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-lg space-y-6 animate-fade-up text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-destructive/15">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 text-destructive">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Processing failed</h1>
            <p className="mt-1 text-xs text-muted-foreground/60 font-mono">{jobId}</p>
          </div>
          <div className="rounded-xl bg-destructive/10 p-4">
            <p className="text-sm text-destructive">{job?.error ?? "An unexpected error occurred."}</p>
          </div>
          <div className="flex justify-center gap-3">
            <Link href="/app/new"><Button className="rounded-xl">Try Again</Button></Link>
            <Link href="/app"><Button variant="outline" className="rounded-xl">Dashboard</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  // Ready state — full-width dark video editor layout
  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col overflow-hidden">
      {/* Top toolbar */}
      <div className="flex items-center justify-between border-b border-border/40 bg-card/50 px-4 py-2">
        <div className="flex items-center gap-3">
          <Link href="/app" className="text-muted-foreground hover:text-foreground transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
          </Link>
          <div className="h-5 w-px bg-border/40" />
          <h2 className="text-sm font-semibold text-foreground">Project Editor</h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{MOCK_SLIDES.length} slides</span>
          <div className="ml-3 flex items-center gap-2">
            <a href={`/api/download/${jobId}`} download>
              <Button size="sm" className="rounded-lg shadow-sm shadow-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="mr-1.5 size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Export
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Video preview + slides */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Video preview */}
          <div className="flex flex-1 items-center justify-center bg-[oklch(0.10_0.02_265)] p-6">
            <div className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-xl bg-[#0a0a1a] shadow-2xl shadow-black/40 ring-1 ring-white/5">
              {/* Mock slide content inside preview */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                <div className="w-full max-w-md space-y-4 text-center">
                  <div className="mx-auto h-1 w-12 rounded-full bg-primary/50" />
                  <div className="text-xl font-bold text-white/90 md:text-2xl tracking-tight">Quarterly Revenue Report</div>
                  <div className="mx-auto grid max-w-sm grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/[0.06] p-3">
                      <div className="text-lg font-bold text-primary">$2.4M</div>
                      <div className="text-[10px] text-white/40">Revenue</div>
                    </div>
                    <div className="rounded-xl bg-white/[0.06] p-3">
                      <div className="text-lg font-bold text-accent">+18%</div>
                      <div className="text-[10px] text-white/40">Growth</div>
                    </div>
                    <div className="rounded-xl bg-white/[0.06] p-3">
                      <div className="text-lg font-bold text-chart-3">847</div>
                      <div className="text-[10px] text-white/40">Clients</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Talking head overlay */}
              <div className="absolute bottom-4 right-4 size-16 rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary/25 to-accent/15 shadow-xl">
                <div className="flex size-full items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-7 text-white/25">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </div>

              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="group flex size-14 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white/80 group-hover:text-white ml-0.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                  </svg>
                </button>
              </div>

              {/* Bottom controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 pt-8">
                <div className="mb-2 h-1 w-full overflow-hidden rounded-full bg-white/15">
                  <div className="h-full w-1/3 rounded-full bg-primary" />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/50">
                  <span className="font-mono">0:11 / 0:33</span>
                  <span>1080p</span>
                </div>
              </div>
            </div>
          </div>

          {/* Slide strip / timeline */}
          <div className="border-t border-border/40 bg-card/30 p-3">
            <SlideStrip slides={MOCK_SLIDES} />
          </div>
        </div>

        {/* Right: AI Chat panel */}
        <div className="w-[380px] flex-shrink-0 border-l border-border/40">
          <ChatEditor jobId={jobId} />
        </div>
      </div>
    </div>
  );
}
