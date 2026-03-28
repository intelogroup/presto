import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary shadow-sm shadow-primary/25">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4 text-primary-foreground">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-foreground">Presto</span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/#how-it-works"
            className="hidden sm:inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            How it works
          </Link>
          <Link
            href="/#pricing"
            className="hidden sm:inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pricing
          </Link>
          <div className="ml-2 flex items-center gap-2">
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground",
                "h-9 px-3"
              )}
            >
              Log in
            </Link>
            <Link
              href="/login"
              className={cn(
                "inline-flex items-center justify-center rounded-lg text-sm font-semibold transition-all",
                "bg-primary text-primary-foreground shadow-sm shadow-primary/25",
                "hover:shadow-md hover:shadow-primary/30",
                "h-9 px-4"
              )}
            >
              Get Started
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
