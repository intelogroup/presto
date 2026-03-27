import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/footer";
import { PricingCard } from "@/components/pricing-card";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    number: 1,
    title: "Upload",
    description: "Drop a video or audio file — MP4, MOV, WebM, MP3, or M4A.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
      </svg>
    ),
  },
  {
    number: 2,
    title: "AI generates slides",
    description: "Speech is transcribed and themed slides are created automatically.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456Z" />
      </svg>
    ),
  },
  {
    number: 3,
    title: "Download video",
    description: "Get a synced presentation video with your talking head overlaid.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "17 presentation themes",
    description: "From dark tech to academic — pick a style that fits your content.",
    gradient: "from-primary/10 to-primary/5",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402M6.75 21A3.75 3.75 0 0 1 3 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 0 0 3.75-3.75V8.197M6.75 17.25h.008v.008H6.75v-.008Z" />
      </svg>
    ),
  },
  {
    title: "AI transcription",
    description: "Whisper-powered speech-to-text with accurate timestamps.",
    gradient: "from-accent/10 to-accent/5",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
      </svg>
    ),
  },
  {
    title: "Face tracking overlay",
    description: "Your talking head follows along, positioned automatically.",
    gradient: "from-chart-3/10 to-chart-3/5",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
      </svg>
    ),
  },
  {
    title: "One-click export",
    description: "Download your finished MP4 — ready to share anywhere.",
    gradient: "from-primary/10 to-accent/5",
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
          {/* Background gradients */}
          <div className="gradient-hero-bg absolute inset-0 -z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/5 blur-3xl -z-10 animate-glow-pulse" />

          <div className="mx-auto max-w-6xl px-4 pt-24 pb-20 text-center md:pt-32 md:pb-28">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                AI-powered video creation
              </span>
            </div>

            <h1 className="mt-6 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl animate-fade-up-delay-1">
              Turn any talk into a
              <br />
              <span className="gradient-text">presentation video</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl animate-fade-up-delay-2">
              Upload a video or audio recording. AI transcribes your speech,
              generates themed slides, and renders a synced presentation — in
              minutes.
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="ml-2 size-4">
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

            {/* Product screenshot placeholder */}
            <div className="mx-auto mt-16 max-w-4xl animate-fade-up-delay-3">
              <div className="relative rounded-2xl border border-border/60 bg-gradient-to-b from-card to-muted/50 p-1.5 shadow-2xl shadow-primary/10">
                <div className="aspect-video w-full rounded-xl bg-muted/80 flex items-center justify-center overflow-hidden">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground/40">
                    <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 text-primary/60">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground/50">Preview coming soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="relative border-t border-border/60 bg-muted/30 py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                How it works
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Three simple steps from recording to polished presentation.
              </p>
            </div>

            <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
              {/* Connector line (desktop) */}
              <div className="absolute top-12 left-[16.6%] right-[16.6%] hidden h-px bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 md:block" />

              {STEPS.map((step, i) => (
                <div key={step.number} className="relative flex flex-col items-center text-center">
                  {/* Step number with glow */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg" />
                    <div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-lg font-bold shadow-lg shadow-primary/25">
                      {step.number}
                    </div>
                  </div>
                  {/* Icon */}
                  <div className="mt-5 flex size-12 items-center justify-center rounded-xl bg-primary/8 text-primary">
                    {step.icon}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-[260px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Everything you need
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Powerful features that handle the heavy lifting for you.
              </p>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {FEATURES.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-border/60 bg-card p-6 gradient-card-hover"
                >
                  <div className={cn(
                    "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-primary",
                    feature.gradient
                  )}>
                    {feature.icon}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative border-t border-border/60 bg-muted/30 py-20 md:py-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,oklch(0.52_0.24_265_/_0.04),transparent)]" />
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Simple pricing
              </h2>
              <p className="mx-auto mt-3 max-w-md text-muted-foreground">
                Start free. Upgrade when you need more.
              </p>
            </div>
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
                  "Chat-based video editor",
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
