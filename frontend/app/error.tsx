"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-sm space-y-4">
        <div className="rounded-lg bg-destructive/10 p-4">
          <h1 className="text-lg font-semibold text-destructive">
            Something went wrong
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p className="mt-1 text-xs text-muted-foreground/70">
              Reference: {error.digest}
            </p>
          )}
        </div>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
