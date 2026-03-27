import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { PricingCard } from "@/components/pricing-card";
import { cn } from "@/lib/utils";

const STEPS = [
  { title: "Upload", desc: "Drop a video or audio file" },
  { title: "Transcribe", desc: "Whisper extracts speech" },
  { title: "Generate", desc: "GPT-4o creates slides" },
  { title: "Track", desc: "BlazeFace syncs your face" },
  { title: "Export", desc: "Download the final MP4" },
];

const FEATURES = [
  {
    title: "17 presentation themes",
    description: "Dark tech, neon, glassmorphism, academic — pick a visual style that matches your message.",
    color: "text-primary",
    bg: "bg-primary/10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 17.25h.008v.008H6.75v-.008Z" />
      </svg>
    ),
  },
  {
    title: "AI transcription",
    description: "Whisper-powered speech-to-text with word-level timestamps for perfect slide sync.",
    color: "text-accent",
    bg: "bg-accent/10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
  {
    title: "Face tracking overlay",
    description: "BlazeFace detects your face in every frame and positions the talking-head circle automatically.",
    color: "text-chart-3",
    bg: "bg-chart-3/10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: "AI chat editor",
    description: "Change slides, timing, themes, and layout by describing what you want in plain English.",
    color: "text-primary",
    bg: "bg-primary/10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
      </svg>
    ),
  },
  {
    title: "One-click export",
    description: "Download a polished MP4 with slides, talking head, and transitions — ready to share.",
    color: "text-accent",
    bg: "bg-accent/10",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="flex min-h-full flex-col">
      <SiteHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          {/* Background — stronger gradients */}
          <div className="absolute inset-0 -z-10 gradient-hero-bg" />

          <div className="mx-auto max-w-5xl px-4 pt-24 pb-16 text-center md:pt-32 md:pb-24">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                AI-powered video creation
              </span>
            </div>

            <h1 className="mt-8 text-5xl font-extrabold tracking-tight text-foreground md:text-6xl lg:text-7xl animate-fade-up-delay-1 leading-[1.1]">
              Turn any talk into a
              <br />
              <span className="gradient-text">presentation video</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground animate-fade-up-delay-2">
              Upload a recording, get AI-generated slides synced to your speech
              with a talking-head overlay — in minutes.
            </p>

            <div className="mt-10 flex items-center justify-center gap-4 animate-fade-up-delay-3">
              <Link
                href="/login"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl text-sm font-semibold transition-all",
                  "bg-primary text-primary-foreground shadow-lg shadow-primary/25",
                  "hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5",
                  "h-12 px-8"
                )}
              >
                Get Started Free
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 size-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="#how-it-works"
                className={cn(
                  "inline-flex items-center justify-center rounded-xl border border-border text-sm font-semibold transition-all",
                  "bg-background/80 backdrop-blur-sm hover:bg-muted hover:border-muted-foreground/20",
                  "h-12 px-8"
                )}
              >
                See how it works
              </Link>
            </div>

            {/* Product mock */}
            <div className="mx-auto mt-16 max-w-4xl animate-fade-up-delay-3">
              <div className="relative rounded-2xl border border-border/50 bg-gradient-to-b from-card to-muted/40 p-1.5 shadow-2xl shadow-primary/8">
                <div className="aspect-video w-full rounded-xl bg-[oklch(0.08_0.02_265)] overflow-hidden relative">
                  {/* Mock slide */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 md:p-10">
                    <div className="w-full max-w-lg space-y-5 text-center">
                      <div className="mx-auto h-1 w-12 rounded-full bg-primary/50" />
                      <div className="text-xl font-bold text-white/90 md:text-3xl tracking-tight">Quarterly Revenue Report</div>
                      <div className="mx-auto grid max-w-md grid-cols-3 gap-3 md:gap-4">
                        <div className="rounded-xl bg-white/[0.06] p-3 md:p-4 backdrop-blur-sm">
                          <div className="text-lg md:text-2xl font-bold text-primary">$2.4M</div>
                          <div className="text-[10px] md:text-xs text-white/40 mt-0.5">Revenue</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.06] p-3 md:p-4 backdrop-blur-sm">
                          <div className="text-lg md:text-2xl font-bold text-accent">+18%</div>
                          <div className="text-[10px] md:text-xs text-white/40 mt-0.5">Growth</div>
                        </div>
                        <div className="rounded-xl bg-white/[0.06] p-3 md:p-4 backdrop-blur-sm">
                          <div className="text-lg md:text-2xl font-bold text-chart-3">847</div>
                          <div className="text-[10px] md:text-xs text-white/40 mt-0.5">Clients</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Talking head */}
                  <div className="absolute bottom-3 right-3 size-14 md:bottom-5 md:right-5 md:size-20 rounded-full border-2 border-primary/30 bg-gradient-to-br from-primary/25 to-accent/15 shadow-xl">
                    <div className="flex size-full items-center justify-center">
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-7 md:size-9 text-white/25">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                      </svg>
                    </div>
                  </div>
                  {/* Slide dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 md:bottom-5">
                    {[true, false, false, false, false].map((active, i) => (
                      <div key={i} className={cn("size-1.5 rounded-full", active ? "bg-primary" : "bg-white/20")} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works — clean horizontal pipeline */}
        <section id="how-it-works" className="border-t border-border/50 bg-muted/30 py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
              How it works
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
              Five automated steps. You just upload and download.
            </p>

            {/* Pipeline — horizontal on desktop, vertical on mobile */}
            <div className="mt-14 flex flex-col items-center gap-3 md:flex-row md:gap-0">
              {STEPS.map((step, i) => (
                <div key={step.title} className="flex items-center md:flex-1">
                  {/* Step pill */}
                  <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-card px-5 py-4 shadow-sm w-full md:w-auto">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">{step.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{step.desc}</div>
                    </div>
                  </div>
                  {/* Connector arrow */}
                  {i < STEPS.length - 1 && (
                    <div className="hidden md:flex shrink-0 px-2 text-border">
                      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features — 2-col with bigger icon containers */}
        <section className="py-20 md:py-24">
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
              Everything you need
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
              Powerful features that handle the heavy lifting for you.
            </p>

            <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="group flex gap-4 rounded-2xl border border-border/50 bg-card p-5 gradient-card-hover"
                >
                  <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-xl", f.bg, f.color)}>
                    {f.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative border-t border-border/50 bg-muted/30 py-20 md:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,oklch(from_var(--primary)_l_c_h_/_0.04),transparent)]" />
          <div className="mx-auto max-w-5xl px-4">
            <h2 className="text-center text-3xl font-bold text-foreground md:text-4xl">
              Simple pricing
            </h2>
            <p className="mx-auto mt-3 max-w-md text-center text-muted-foreground">
              Start free. Upgrade when you need more.
            </p>
            <div className="mx-auto mt-14 grid max-w-2xl grid-cols-1 gap-6 sm:grid-cols-2">
              <PricingCard
                name="Free"
                price="Free"
                description="For trying things out."
                features={[
                  "3 presentations / month",
                  "720p video export",
                  "All 17 themes",
                  "AI transcription",
                ]}
                cta="Get Started"
                href="/login"
              />
              <PricingCard
                name="Pro"
                price="$19"
                description="For creators who ship regularly."
                features={[
                  "Unlimited presentations",
                  "1080p video export",
                  "Priority rendering",
                  "AI chat editor",
                  "All 17 themes",
                ]}
                cta="Upgrade to Pro"
                href="/login"
                highlighted
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
