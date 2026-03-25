// src/Presentation8Demo.tsx
// "Clean Minimalist" — off-white bg, charcoal, generous whitespace, Apple/Linear/Vercel aesthetic

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

import { MinimalHeroSlide8 } from "./slides8/MinimalHeroSlide8";
import { MinimalStatsSlide8 } from "./slides8/MinimalStatsSlide8";
import { MinimalListSlide8 } from "./slides8/MinimalListSlide8";
import { MinimalQuoteSlide8 } from "./slides8/MinimalQuoteSlide8";
import { MinimalGridSlide8 } from "./slides8/MinimalGridSlide8";
import { MinimalClosingSlide8 } from "./slides8/MinimalClosingSlide8";
import { MinimalIconFeaturesSlide8 } from "./slides8/MinimalIconFeaturesSlide8";
import { MinimalProgressBarsSlide8 } from "./slides8/MinimalProgressBarsSlide8";
import { Presentation8Props } from "./schema";

export const Presentation8Demo: React.FC<Presentation8Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={slide({ direction: "from-right" }) as any}
          timing={linearTiming({ durationInFrames: 15 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "minimalHero") {
      SlideEl = (
        <MinimalHeroSlide8
          title={slideData.title}
          subtitle={slideData.subtitle}
          tag={slideData.tag}
        />
      );
    } else if (slideData.type === "minimalStats") {
      SlideEl = (
        <MinimalStatsSlide8
          title={slideData.title}
          stats={slideData.stats}
        />
      );
    } else if (slideData.type === "minimalList") {
      SlideEl = (
        <MinimalListSlide8
          title={slideData.title}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "minimalQuote") {
      SlideEl = (
        <MinimalQuoteSlide8
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
        />
      );
    } else if (slideData.type === "minimalGrid") {
      SlideEl = (
        <MinimalGridSlide8
          headline={slideData.headline}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "minimalIconFeatures") {
      SlideEl = (
        <MinimalIconFeaturesSlide8
          headline={slideData.headline}
          features={slideData.features}
        />
      );
    } else if (slideData.type === "minimalProgressBars") {
      SlideEl = (
        <MinimalProgressBarsSlide8
          title={slideData.title}
          bars={slideData.bars}
        />
      );
    } else {
      // minimalClosing
      SlideEl = (
        <MinimalClosingSlide8
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
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
