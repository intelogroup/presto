// "Glassmorphism Dark" — dark gray bg, frosted glass cards, glowing teal/blue/violet accents

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { GlassHeroSlide5 } from "./slides5/GlassHeroSlide5";
import { GlassStatsSlide5 } from "./slides5/GlassStatsSlide5";
import { GlassGridSlide5 } from "./slides5/GlassGridSlide5";
import { GlassQuoteSlide5 } from "./slides5/GlassQuoteSlide5";
import { GlassBarSlide5 } from "./slides5/GlassBarSlide5";
import { GlassClosingSlide5 } from "./slides5/GlassClosingSlide5";
import { GlassIconFeaturesSlide5 } from "./slides5/GlassIconFeaturesSlide5";
import { GlassDonutSlide5 } from "./slides5/GlassDonutSlide5";
import { Presentation5Props } from "./schema";

export const Presentation5Demo: React.FC<Presentation5Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index !== 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={fade() as any}
          timing={linearTiming({ durationInFrames: 15 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "glassHero") {
      SlideEl = (
        <GlassHeroSlide5
          title={slideData.title}
          subtitle={slideData.subtitle}
          tag={slideData.tag}
        />
      );
    } else if (slideData.type === "glassStats") {
      SlideEl = (
        <GlassStatsSlide5
          title={slideData.title}
          stats={slideData.stats}
        />
      );
    } else if (slideData.type === "glassGrid") {
      SlideEl = (
        <GlassGridSlide5
          headline={slideData.headline}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "glassQuote") {
      SlideEl = (
        <GlassQuoteSlide5
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
        />
      );
    } else if (slideData.type === "glassBar") {
      SlideEl = (
        <GlassBarSlide5
          title={slideData.title}
          bars={slideData.bars}
        />
      );
    } else if (slideData.type === "glassIconFeatures") {
      SlideEl = (
        <GlassIconFeaturesSlide5
          headline={slideData.headline}
          features={slideData.features}
        />
      );
    } else if (slideData.type === "glassDonut") {
      SlideEl = (
        <GlassDonutSlide5
          title={slideData.title}
          segments={slideData.segments}
          centerLabel={slideData.centerLabel}
          centerValue={slideData.centerValue}
        />
      );
    } else {
      // glassClosing
      SlideEl = (
        <GlassClosingSlide5
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
    <AbsoluteFill>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
