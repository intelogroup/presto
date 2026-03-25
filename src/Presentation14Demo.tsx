// src/Presentation14Demo.tsx
// "Broadsheet / Newspaper" — newsprint cream, serif typography, column rules, NYT front-page aesthetic

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

import { BroadHeroSlide14 } from "./slides14/BroadHeroSlide14";
import { BroadLeadSlide14 } from "./slides14/BroadLeadSlide14";
import { BroadStatsSlide14 } from "./slides14/BroadStatsSlide14";
import { BroadQuoteSlide14 } from "./slides14/BroadQuoteSlide14";
import { BroadGridSlide14 } from "./slides14/BroadGridSlide14";
import { BroadTimelineSlide14 } from "./slides14/BroadTimelineSlide14";
import { BroadClosingSlide14 } from "./slides14/BroadClosingSlide14";
import { Presentation14Props } from "./schema";

export const Presentation14Demo: React.FC<Presentation14Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={slide({ direction: "from-right" }) as any}
          timing={linearTiming({ durationInFrames: 20 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "broadHero") {
      SlideEl = (
        <BroadHeroSlide14
          headline={slideData.headline}
          deck={slideData.deck}
          byline={slideData.byline}
          date={slideData.date}
        />
      );
    } else if (slideData.type === "broadLead") {
      SlideEl = (
        <BroadLeadSlide14
          section={slideData.section}
          headline={slideData.headline}
          body={slideData.body}
          pullQuote={slideData.pullQuote}
        />
      );
    } else if (slideData.type === "broadStats") {
      SlideEl = (
        <BroadStatsSlide14
          section={slideData.section}
          headline={slideData.headline}
          stats={slideData.stats}
        />
      );
    } else if (slideData.type === "broadQuote") {
      SlideEl = (
        <BroadQuoteSlide14
          section={slideData.section}
          quote={slideData.quote}
          attribution={slideData.attribution}
          title={slideData.title}
        />
      );
    } else if (slideData.type === "broadGrid") {
      SlideEl = (
        <BroadGridSlide14
          section={slideData.section}
          headline={slideData.headline}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "broadTimeline") {
      SlideEl = (
        <BroadTimelineSlide14
          section={slideData.section}
          headline={slideData.headline}
          events={slideData.events}
        />
      );
    } else {
      // broadClosing
      SlideEl = (
        <BroadClosingSlide14
          headline={slideData.headline}
          edition={slideData.edition}
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
    <AbsoluteFill style={{ backgroundColor: "#F5F0E8" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
