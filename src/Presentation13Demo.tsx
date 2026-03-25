// src/Presentation13Demo.tsx
// P13 "Diagonal Split / Color-Block Geometry" — Studio Nova architecture & interior design
// Wipe transitions, warm off-white background, animated diagonal color blocks

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";

import { DiagHeroSlide13 } from "./slides13/DiagHeroSlide13";
import { DiagStatSlide13 } from "./slides13/DiagStatSlide13";
import { DiagGridSlide13 } from "./slides13/DiagGridSlide13";
import { DiagQuoteSlide13 } from "./slides13/DiagQuoteSlide13";
import { DiagListSlide13 } from "./slides13/DiagListSlide13";
import { DiagTimelineSlide13 } from "./slides13/DiagTimelineSlide13";
import { DiagClosingSlide13 } from "./slides13/DiagClosingSlide13";
import { Presentation13Props } from "./schema";

export const Presentation13Demo: React.FC<Presentation13Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={wipe({ direction: "from-right" }) as any}
          timing={linearTiming({ durationInFrames: 15 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "diagHero") {
      SlideEl = (
        <DiagHeroSlide13
          eyebrow={slideData.eyebrow}
          title={slideData.title}
          subtitle={slideData.subtitle}
          accent={slideData.accent}
        />
      );
    } else if (slideData.type === "diagStat") {
      SlideEl = (
        <DiagStatSlide13
          value={slideData.value}
          label={slideData.label}
          context={slideData.context}
          accent={slideData.accent}
        />
      );
    } else if (slideData.type === "diagGrid") {
      SlideEl = (
        <DiagGridSlide13
          headline={slideData.headline}
          items={slideData.items}
          accent={slideData.accent}
        />
      );
    } else if (slideData.type === "diagQuote") {
      SlideEl = (
        <DiagQuoteSlide13
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
          accent={slideData.accent}
        />
      );
    } else if (slideData.type === "diagList") {
      SlideEl = (
        <DiagListSlide13
          title={slideData.title}
          items={slideData.items}
          accent={slideData.accent}
        />
      );
    } else if (slideData.type === "diagTimeline") {
      SlideEl = (
        <DiagTimelineSlide13
          title={slideData.title}
          events={slideData.events}
          accent={slideData.accent}
        />
      );
    } else {
      // diagClosing
      SlideEl = (
        <DiagClosingSlide13
          headline={slideData.headline}
          sub={slideData.sub}
          accent={slideData.accent}
        />
      );
    }

    children.push(
      <TransitionSeries.Sequence key={`s-${index}`} durationInFrames={slideData.duration}>
        {SlideEl}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#F2F2F0" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
