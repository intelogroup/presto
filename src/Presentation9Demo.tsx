// src/Presentation9Demo.tsx
// "Vaporwave / Retro-Futurism" — deep purple bg, hot pink/electric blue neons, retrowave aesthetic

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

import { VaporHeroSlide9 } from "./slides9/VaporHeroSlide9";
import { VaporStatSlide9 } from "./slides9/VaporStatSlide9";
import { VaporGridSlide9 } from "./slides9/VaporGridSlide9";
import { VaporListSlide9 } from "./slides9/VaporListSlide9";
import { VaporQuoteSlide9 } from "./slides9/VaporQuoteSlide9";
import { VaporTimelineSlide9 } from "./slides9/VaporTimelineSlide9";
import { VaporClosingSlide9 } from "./slides9/VaporClosingSlide9";
import { Presentation9Props } from "./schema";

export const Presentation9Demo: React.FC<Presentation9Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={slide({ direction: "from-right" }) as any}
          timing={linearTiming({ durationInFrames: 12 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "vaporHero") {
      SlideEl = (
        <VaporHeroSlide9
          title={slideData.title}
          subtitle={slideData.subtitle}
          tag={slideData.tag}
        />
      );
    } else if (slideData.type === "vaporStat") {
      SlideEl = (
        <VaporStatSlide9
          label={slideData.label}
          value={slideData.value}
          sublabel={slideData.sublabel}
          accent={slideData.accent}
        />
      );
    } else if (slideData.type === "vaporGrid") {
      SlideEl = (
        <VaporGridSlide9
          headline={slideData.headline}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "vaporList") {
      SlideEl = (
        <VaporListSlide9
          title={slideData.title}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "vaporQuote") {
      SlideEl = (
        <VaporQuoteSlide9
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
        />
      );
    } else if (slideData.type === "vaporTimeline") {
      SlideEl = (
        <VaporTimelineSlide9
          title={slideData.title}
          milestones={slideData.milestones}
        />
      );
    } else {
      // vaporClosing
      SlideEl = (
        <VaporClosingSlide9
          word={slideData.word}
          tagline={slideData.tagline}
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
    <AbsoluteFill style={{ backgroundColor: "#0D0019" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
