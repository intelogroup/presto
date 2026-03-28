"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  jobId: string;
  filename: string;
  status: "processing" | "ready" | "failed";
  theme?: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const ts = new Date(dateStr).getTime();
  if (Number.isNaN(ts)) return "unknown";
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ProjectCard({
  jobId,
  filename,
  status,
  theme,
  createdAt,
}: ProjectCardProps) {
  return (
    <Link
      href={`/app/project/${jobId}`}
      className="group block rounded-2xl border border-border/60 bg-card gradient-card-hover overflow-hidden"
    >
      {/* Thumbnail placeholder */}
      <div className={cn(
        "relative aspect-video w-full flex items-center justify-center",
        status === "processing" ? "bg-gradient-to-br from-primary/25 via-primary/10 to-card"
          : status === "ready" ? "bg-gradient-to-br from-accent/25 via-accent/10 to-card"
          : "bg-gradient-to-br from-destructive/20 via-destructive/8 to-card"
      )}>
        <div className={cn(
          "flex size-12 items-center justify-center rounded-2xl transition-transform group-hover:scale-110",
          status === "processing" ? "bg-primary/10" : status === "ready" ? "bg-accent/10" : "bg-destructive/10"
        )}>
          {status === "processing" ? (
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-primary animate-spin">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
            </svg>
          ) : status === "ready" ? (
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-accent">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          ) : (
            <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-destructive">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
            </svg>
          )}
        </div>
      </div>

      <div className="p-4 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
            {filename}
          </p>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {theme && <span className="rounded-md bg-muted px-1.5 py-0.5">{theme}</span>}
          <span>{timeAgo(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
