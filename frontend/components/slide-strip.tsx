"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Slide {
  index: number;
  type: string;
  durationSec: number;
}

interface SlideStripProps {
  slides: Slide[];
}

const SLIDE_COLORS: Record<string, string> = {
  Title: "from-primary/20 to-primary/5",
  Content: "from-accent/20 to-accent/5",
  Chart: "from-chart-3/20 to-chart-3/5",
  Summary: "from-primary/15 to-accent/5",
};

export function SlideStrip({ slides }: SlideStripProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
      {slides.map((slide, i) => (
        <button
          key={slide.index}
          onClick={() => setSelected(i)}
          className={cn(
            "group relative flex-shrink-0 w-28 rounded-lg overflow-hidden transition-all duration-200",
            selected === i
              ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-105"
              : "ring-1 ring-border/40 hover:ring-border"
          )}
        >
          <div className={cn(
            "aspect-video flex flex-col items-center justify-center bg-gradient-to-br",
            SLIDE_COLORS[slide.type] ?? "from-muted to-muted/60"
          )}>
            <span className={cn(
              "text-[10px] font-semibold",
              selected === i ? "text-foreground" : "text-muted-foreground"
            )}>
              {slide.type}
            </span>
            <span className="text-[9px] text-muted-foreground/60 mt-0.5">
              Slide {slide.index}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 rounded-tl-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5">
            <span className="text-[9px] font-medium text-white/80">{slide.durationSec}s</span>
          </div>
        </button>
      ))}

      {/* Add slide button */}
      <button className="flex-shrink-0 flex size-[52px] items-center justify-center rounded-lg border border-dashed border-border/40 text-muted-foreground/40 transition-colors hover:border-primary/40 hover:text-primary/60">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}
