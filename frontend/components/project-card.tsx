"use client";

import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";

interface ProjectCardProps {
  jobId: string;
  filename: string;
  status: "processing" | "ready" | "failed";
  theme?: string;
  createdAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
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
      className="group block rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Thumbnail placeholder */}
      <div className="aspect-video w-full rounded-t-xl bg-muted flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="size-10 text-muted-foreground/30"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
          />
        </svg>
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary">
            {filename}
          </p>
          <StatusBadge status={status} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {theme && <span>{theme}</span>}
          {theme && <span>·</span>}
          <span>{timeAgo(createdAt)}</span>
        </div>
      </div>
    </Link>
  );
}
