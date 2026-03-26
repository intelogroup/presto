"use client";

import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { StatusTracker } from "@/components/status-tracker";

interface JobStatus {
  jobId: string;
  status: string;
  step: string;
  error?: string;
}

// Next.js 15: params is a Promise — unwrap with use()
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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {isDone ? "Done!" : isError ? "Failed" : "Processing…"}
          </h1>
          <p className="text-xs text-gray-400 mt-1 font-mono">{jobId}</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          {job ? (
            <StatusTracker
              step={job.step}
              status={job.status}
              error={job.error}
            />
          ) : fetchError ? (
            <p className="text-sm text-gray-500">{fetchError}</p>
          ) : (
            <p className="text-sm text-gray-400">Connecting…</p>
          )}
        </div>

        {isDone && (
          <div className="flex gap-3">
            <a href={`/api/download/${jobId}`} download>
              <Button>Download video</Button>
            </a>
            <a href="/">
              <Button variant="outline">Start over</Button>
            </a>
          </div>
        )}

        {isError && (
          <a href="/">
            <Button variant="outline">Try again</Button>
          </a>
        )}
      </div>
    </main>
  );
}
