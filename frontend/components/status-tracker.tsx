"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const STEPS = [
  "uploading",
  "preprocessing",
  "transcribing",
  "generating_slides",
  "rendering",
  "done",
] as const;

type Step = (typeof STEPS)[number];

const STEP_CONFIG: Record<Step, { label: string; icon: React.ReactNode }> = {
  uploading: {
    label: "Uploading",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
      </svg>
    ),
  },
  preprocessing: {
    label: "Preprocessing",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
      </svg>
    ),
  },
  transcribing: {
    label: "Transcribing audio",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
  generating_slides: {
    label: "Generating slides",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  rendering: {
    label: "Rendering video",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  done: {
    label: "Done",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
      </svg>
    ),
  },
};

interface StatusTrackerProps {
  step: string;
  status: string;
  error?: string;
}

export function StatusTracker({ step, status, error }: StatusTrackerProps) {
  const currentIndex = STEPS.indexOf(step as Step);
  const progress =
    status === "done"
      ? 100
      : currentIndex >= 0
      ? Math.round(((currentIndex + 1) / STEPS.length) * 100)
      : 0;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium">{progress}%</span>
        </div>
        <Progress value={progress} className="h-2.5" />
      </div>
      <div className="space-y-1">
        {STEPS.map((s, i) => {
          const isDone = status === "done" || i < currentIndex;
          const isCurrent = s === step && status !== "done";
          const isPending = i > currentIndex && status !== "done";
          const config = STEP_CONFIG[s];

          return (
            <div
              key={s}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors",
                isCurrent && "bg-primary/5",
                isDone && "opacity-80"
              )}
            >
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full transition-all",
                  isDone
                    ? "bg-accent/15 text-accent"
                    : isCurrent
                    ? "bg-primary/15 text-primary animate-pulse"
                    : "bg-muted text-muted-foreground/40"
                )}
              >
                {isDone ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                ) : (
                  config.icon
                )}
              </div>
              <span
                className={cn(
                  "text-sm flex-1",
                  isDone
                    ? "text-muted-foreground"
                    : isCurrent
                    ? "font-semibold text-foreground"
                    : isPending
                    ? "text-muted-foreground/40"
                    : "text-muted-foreground"
                )}
              >
                {config.label}
              </span>
              {isCurrent && (
                <Badge variant="outline" className="text-xs border-primary/30 text-primary bg-primary/5">
                  In progress
                </Badge>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <div className="flex items-start gap-2.5 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="mt-0.5 size-5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
