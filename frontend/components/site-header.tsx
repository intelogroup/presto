import Link from "next/link";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-foreground">
          Presto
        </Link>
        <nav className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all",
              "hover:bg-muted hover:text-foreground",
              "h-7 px-2.5"
            )}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className={cn(
              "inline-flex shrink-0 items-center justify-center rounded-lg text-sm font-medium transition-all",
              "bg-primary text-primary-foreground",
              "h-7 px-2.5"
            )}
          >
            Get Started
          </Link>
        </nav>
      </div>
    </header>
  );
}
