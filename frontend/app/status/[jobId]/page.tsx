"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { StatusTracker } from "@/components/status-tracker";

interface JobStatus {
  jobId: string;
  status: string;
  step: string;
  error?: string;
}

// Next.js 16: params is a Promise — unwrap with use()
export default function StatusPage({
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
        const data: JobStatus = await res.json();
        setJob(data);
        if (data.status !== "done" && data.status !== "error") {
          timeout = setTimeout(poll, 2000);
        }
      } catch {
        setFetchError("Lost connection — retrying…");
        timeout = setTimeout(poll, 4000);
      }
    }

    poll();
    return () => clearTimeout(timeout);
  }, [jobId]);

  const isDone = job?.status === "done";
  const isError = job?.status === "error";

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6 animate-fade-up">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {isDone ? (
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </span>
                Done!
              </span>
            ) : isError ? (
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-destructive/15 text-destructive">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                  </svg>
                </span>
                Failed
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary/15 text-primary">
                  <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                </span>
                Processing…
              </span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground/60 mt-1.5 font-mono pl-10">{jobId}</p>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-lg shadow-primary/5">
          {job ? (
            <StatusTracker
              step={job.step}
              status={job.status}
              error={job.error}
            />
          ) : fetchError ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              {fetchError}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <svg className="size-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Connecting…
            </div>
          )}
        </div>

        {isDone && (
          <div className="flex gap-3">
            <a href={`/api/download/${jobId}`} download className="inline-flex items-center justify-center rounded-xl bg-primary px-6 h-11 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="mr-2 size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download video
            </a>
            <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-6 h-11 text-sm font-semibold shadow-sm hover:bg-accent hover:text-accent-foreground">Start over</Link>
          </div>
        )}

        {isError && (
          <Link href="/" className="inline-flex items-center justify-center rounded-xl border border-input bg-background px-6 h-11 text-sm font-semibold shadow-sm hover:bg-accent hover:text-accent-foreground">Try again</Link>
        )}
      </div>
    </main>
  );
}
