"use client";

import Link from "next/link";
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
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-destructive/8 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-md space-y-6 animate-fade-up">
        {/* Icon */}
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-destructive/10 ring-1 ring-destructive/20">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="size-10 text-destructive">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            An unexpected error occurred. This has been logged and we&apos;re looking into it.
          </p>
        </div>

        {/* Error details (collapsed) */}
        {error.digest && (
          <div className="rounded-xl border border-border/60 bg-card/50 px-4 py-3">
            <p className="text-xs text-muted-foreground/60 font-mono">
              Reference: {error.digest}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button onClick={reset} className="rounded-xl shadow-md shadow-primary/20">
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" className="rounded-xl">
              Go home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
