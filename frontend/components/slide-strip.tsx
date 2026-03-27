interface Slide {
  index: number;
  type: string;
  durationSec: number;
}

interface SlideStripProps {
  slides: Slide[];
}

export function SlideStrip({ slides }: SlideStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {slides.map((slide) => (
        <div
          key={slide.index}
          className="relative flex-shrink-0 w-24 rounded-md border border-border bg-muted overflow-hidden"
        >
          <div className="aspect-video flex items-center justify-center">
            <span className="text-[10px] font-medium text-muted-foreground">
              {slide.type}
            </span>
          </div>
          <div className="absolute bottom-0 right-0 rounded-tl bg-foreground/70 px-1 py-0.5">
            <span className="text-[9px] font-medium text-background">
              {slide.durationSec}s
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
