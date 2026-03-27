import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[600px] rounded-full bg-primary/6 blur-[100px]" />
        <div className="absolute top-1/2 left-1/3 h-[300px] w-[300px] rounded-full bg-accent/4 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-md space-y-6 animate-fade-up">
        {/* Visual — broken film strip / slide */}
        <div className="mx-auto relative w-fit">
          <div className="flex items-center gap-3">
            {/* Left slide fragment */}
            <div className="h-20 w-14 rounded-lg bg-primary/10 ring-1 ring-primary/20 rotate-[-8deg] translate-y-1" />
            {/* Center "404" */}
            <div className="relative">
              <span className="text-7xl font-black tracking-tighter gradient-text">404</span>
            </div>
            {/* Right slide fragment */}
            <div className="h-20 w-14 rounded-lg bg-accent/10 ring-1 ring-accent/20 rotate-[8deg] translate-y-1" />
          </div>
        </div>

        {/* Copy */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-foreground">Page not found</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            This page doesn&apos;t exist or may have been moved. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <Link href="/">
            <Button className="rounded-xl shadow-md shadow-primary/20">
              Go home
            </Button>
          </Link>
          <Link href="/app">
            <Button variant="outline" className="rounded-xl">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
