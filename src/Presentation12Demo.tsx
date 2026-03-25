// src/Presentation12Demo.tsx
// P12 — Kinetic Typography / Motion-First — APEX extreme sports brand
// Transitions: fast fade cuts (8 frames) like a commercial, not a presentation

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { KineticHeroSlide12 } from "./slides12/KineticHeroSlide12";
import { KineticStatSlide12 } from "./slides12/KineticStatSlide12";
import { KineticSplitSlide12 } from "./slides12/KineticSplitSlide12";
import { KineticListSlide12 } from "./slides12/KineticListSlide12";
import { KineticQuoteSlide12 } from "./slides12/KineticQuoteSlide12";
import { KineticCounterSlide12 } from "./slides12/KineticCounterSlide12";
import { KineticClosingSlide12 } from "./slides12/KineticClosingSlide12";
import { Presentation12Props } from "./schema";

export const Presentation12Demo: React.FC<Presentation12Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={fade() as any}
          timing={linearTiming({ durationInFrames: 8 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "kineticHero") {
      SlideEl = (
        <KineticHeroSlide12
          word1={slideData.word1}
          word2={slideData.word2}
          tagline={slideData.tagline}
        />
      );
    } else if (slideData.type === "kineticStat") {
      SlideEl = (
        <KineticStatSlide12
          value={slideData.value}
          label={slideData.label}
          color={slideData.color}
        />
      );
    } else if (slideData.type === "kineticSplit") {
      SlideEl = (
        <KineticSplitSlide12
          left={slideData.left}
          right={slideData.right}
          connector={slideData.connector}
        />
      );
    } else if (slideData.type === "kineticList") {
      SlideEl = (
        <KineticListSlide12
          items={slideData.items}
        />
      );
    } else if (slideData.type === "kineticQuote") {
      SlideEl = (
        <KineticQuoteSlide12
          quote={slideData.quote}
          author={slideData.author}
        />
      );
    } else if (slideData.type === "kineticCounter") {
      SlideEl = (
        <KineticCounterSlide12
          from={slideData.from}
          to={slideData.to}
          suffix={slideData.suffix}
          label={slideData.label}
          color={slideData.color}
        />
      );
    } else if (slideData.type === "kineticClosing") {
      SlideEl = (
        <KineticClosingSlide12
          brand={slideData.brand}
          call={slideData.call}
        />
      );
    } else {
      SlideEl = (
        <AbsoluteFill style={{ backgroundColor: "#000000" }} />
      );
    }

    children.push(
      <TransitionSeries.Sequence
        key={`s-${index}`}
        durationInFrames={slideData.duration}
      >
        {SlideEl}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <TransitionSeries>
        {children}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
