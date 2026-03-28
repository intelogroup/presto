import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary shadow-sm shadow-primary/25">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5 text-primary-foreground">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                </svg>
              </div>
              <span className="font-bold text-foreground">Presto</span>
            </div>
            <p className="max-w-xs text-sm text-muted-foreground">
              Turn any talk into a polished presentation video with AI.
            </p>
          </div>

          {/* Links */}
          <nav className="flex gap-8 text-sm">
            <div className="space-y-3">
              <p className="font-semibold text-foreground">Product</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Link href="/#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
                <Link href="/#pricing" className="hover:text-foreground transition-colors">Pricing</Link>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-semibold text-foreground">Legal</p>
              <div className="flex flex-col gap-2 text-muted-foreground">
                <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              </div>
            </div>
          </nav>
        </div>

        <div className="mt-10 border-t border-border/40 pt-6">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Presto. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
