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
  Title: "from-primary/25 to-primary/10",
  Content: "from-accent/25 to-accent/10",
  Chart: "from-chart-3/25 to-chart-3/10",
  Summary: "from-primary/20 to-accent/10",
};

export function SlideStrip({ slides }: SlideStripProps) {
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex items-end gap-2 overflow-x-auto pb-1 px-1">
      {slides.map((slide, i) => (
        <button
          key={slide.index}
          onClick={() => setSelected(i)}
          className={cn(
            "group relative flex-shrink-0 w-32 rounded-lg overflow-hidden transition-all duration-200",
            selected === i
              ? "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
              : "ring-1 ring-white/10 hover:ring-white/20"
          )}
        >
          <div className={cn(
            "flex flex-col items-center justify-center bg-gradient-to-br h-[72px]",
            SLIDE_COLORS[slide.type] ?? "from-muted to-muted/60"
          )}>
            <span className={cn(
              "text-xs font-semibold",
              selected === i ? "text-foreground" : "text-muted-foreground"
            )}>
              {slide.type}
            </span>
            <span className="text-[10px] text-muted-foreground/50 mt-0.5">
              Slide {slide.index}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 rounded-tl-md bg-black/60 backdrop-blur-sm px-1.5 py-0.5">
            <span className="text-[10px] font-medium text-white/70">{slide.durationSec}s</span>
          </div>
        </button>
      ))}

      {/* Add slide */}
      <button className="flex-shrink-0 flex items-center justify-center w-16 h-[72px] rounded-lg border border-dashed border-white/10 text-white/20 transition-colors hover:border-primary/40 hover:text-primary/50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
    </div>
  );
}
