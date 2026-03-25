// src/Presentation4Demo.tsx
// "Bold Swiss / Brutalist" style — Presentation4
// Contrasts with all previous styles:
//   — Pure white + jet-black + hot-red + electric-yellow palette
//   — System-sans, 900 weight, ALL CAPS, zero border-radius, no gradients
//   — Hard geometric shapes, thick accent bars, typographic poster energy
//   — Fast hard-wipe transitions (10 frames) vs the slower fades/flips of P1-P3

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";
import { slide } from "@remotion/transitions/slide";

import { BrutalistHeroSlide4 } from "./slides4/BrutalistHeroSlide4";
import { WordStampSlide4 } from "./slides4/WordStampSlide4";
import { TriGridSlide4 } from "./slides4/TriGridSlide4";
import { HalfBleedSlide4 } from "./slides4/HalfBleedSlide4";
import { BoldQuoteSlide4 } from "./slides4/BoldQuoteSlide4";
import { ClosingStripeSlide4 } from "./slides4/ClosingStripeSlide4";
import { Presentation4Props } from "./schema";

const TRANSITIONS = [
  wipe({ direction: "from-right" }),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-left" }),
  slide({ direction: "from-top" }),
  wipe({ direction: "from-right" }),
];

export const Presentation4Demo: React.FC<Presentation4Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    const transition = index === 0 ? null : TRANSITIONS[index % TRANSITIONS.length];

    if (transition) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={transition as any}
          timing={linearTiming({ durationInFrames: 10 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "brutalistHero") {
      SlideEl = (
        <BrutalistHeroSlide4
          title={slideData.title}
          tag={slideData.tag}
          subtitle={slideData.subtitle}
        />
      );
    } else if (slideData.type === "wordStamp") {
      SlideEl = (
        <WordStampSlide4
          words={slideData.words}
          keyWordIndex={slideData.keyWordIndex}
          caption={slideData.caption}
        />
      );
    } else if (slideData.type === "triGrid") {
      SlideEl = (
        <TriGridSlide4
          headline={slideData.headline}
          columns={slideData.columns}
        />
      );
    } else if (slideData.type === "halfBleed") {
      SlideEl = (
        <HalfBleedSlide4
          bigValue={slideData.bigValue}
          bigLabel={slideData.bigLabel}
          facts={slideData.facts}
        />
      );
    } else if (slideData.type === "boldQuote") {
      SlideEl = (
        <BoldQuoteSlide4
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
        />
      );
    } else {
      // closingStripe
      SlideEl = (
        <ClosingStripeSlide4
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
    <AbsoluteFill>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
