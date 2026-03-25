// src/Presentation10Demo.tsx
// P10 "Warm Organic / Editorial" — Verdant sustainable D2C brand investor pitch
// Cream backgrounds, terracotta accents, serif type — Kinfolk aesthetic

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

import { OrganicHeroSlide10 } from "./slides10/OrganicHeroSlide10";
import { OrganicStatsSlide10 } from "./slides10/OrganicStatsSlide10";
import { OrganicListSlide10 } from "./slides10/OrganicListSlide10";
import { OrganicQuoteSlide10 } from "./slides10/OrganicQuoteSlide10";
import { OrganicGridSlide10 } from "./slides10/OrganicGridSlide10";
import { OrganicTimelineSlide10 } from "./slides10/OrganicTimelineSlide10";
import { OrganicClosingSlide10 } from "./slides10/OrganicClosingSlide10";
import { Presentation10Props } from "./schema";

export const Presentation10Demo: React.FC<Presentation10Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={slide({ direction: "from-right" }) as any}
          timing={linearTiming({ durationInFrames: 18 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "organicHero") {
      SlideEl = (
        <OrganicHeroSlide10
          eyebrow={slideData.eyebrow}
          title={slideData.title}
          subtitle={slideData.subtitle}
        />
      );
    } else if (slideData.type === "organicStats") {
      SlideEl = (
        <OrganicStatsSlide10
          title={slideData.title}
          stats={slideData.stats}
        />
      );
    } else if (slideData.type === "organicList") {
      SlideEl = (
        <OrganicListSlide10
          title={slideData.title}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "organicQuote") {
      SlideEl = (
        <OrganicQuoteSlide10
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
        />
      );
    } else if (slideData.type === "organicGrid") {
      SlideEl = (
        <OrganicGridSlide10
          headline={slideData.headline}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "organicTimeline") {
      SlideEl = (
        <OrganicTimelineSlide10
          title={slideData.title}
          milestones={slideData.milestones}
        />
      );
    } else {
      // organicClosing
      SlideEl = (
        <OrganicClosingSlide10
          headline={slideData.headline}
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
    <AbsoluteFill style={{ backgroundColor: "#F9F4EE" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
