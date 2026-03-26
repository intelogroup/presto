"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const STEPS = [
  "uploading",
  "preprocessing",
  "transcribing",
  "generating_slides",
  "rendering",
  "done",
] as const;

type Step = (typeof STEPS)[number];

const STEP_LABELS: Record<Step, string> = {
  uploading: "Uploading",
  preprocessing: "Preprocessing",
  transcribing: "Transcribing audio",
  generating_slides: "Generating slides",
  rendering: "Rendering video",
  done: "Done",
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
    <div className="space-y-4">
      <Progress value={progress} className="h-2" />
      <div className="space-y-2">
        {STEPS.map((s, i) => {
          const isDone = status === "done" || i < currentIndex;
          const isCurrent = s === step && status !== "done";
          const isPending = i > currentIndex && status !== "done";

          return (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`h-2 w-2 rounded-full flex-shrink-0 ${
                  isDone
                    ? "bg-green-500"
                    : isCurrent
                    ? "bg-blue-500 animate-pulse"
                    : "bg-gray-200"
                }`}
              />
              <span
                className={`text-sm ${
                  isDone
                    ? "text-green-700"
                    : isCurrent
                    ? "font-medium text-blue-700"
                    : isPending
                    ? "text-gray-400"
                    : "text-gray-600"
                }`}
              >
                {STEP_LABELS[s]}
              </span>
              {isCurrent && (
                <Badge variant="outline" className="text-xs">
                  In progress
                </Badge>
              )}
              {isDone && s !== "done" && (
                <span className="text-xs text-green-600">✓</span>
              )}
            </div>
          );
        })}
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
