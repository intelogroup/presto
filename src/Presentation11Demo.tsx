// src/Presentation11Demo.tsx
// "Blueprint / Technical Schematic" — deep navy, blueprint blue, amber, CAD aesthetic

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";

import { BlueprintHeroSlide11 } from "./slides11/BlueprintHeroSlide11";
import { BlueprintSpecSlide11 } from "./slides11/BlueprintSpecSlide11";
import { BlueprintListSlide11 } from "./slides11/BlueprintListSlide11";
import { BlueprintQuoteSlide11 } from "./slides11/BlueprintQuoteSlide11";
import { BlueprintDiagramSlide11 } from "./slides11/BlueprintDiagramSlide11";
import { BlueprintGridSlide11 } from "./slides11/BlueprintGridSlide11";
import { BlueprintClosingSlide11 } from "./slides11/BlueprintClosingSlide11";
import { Presentation11Props } from "./schema";

export const Presentation11Demo: React.FC<Presentation11Props> = ({ slides }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    if (index > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={slide({ direction: "from-right" }) as any}
          timing={linearTiming({ durationInFrames: 10 })}
        />
      );
    }

    let SlideEl: React.ReactElement;

    if (slideData.type === "blueprintHero") {
      SlideEl = (
        <BlueprintHeroSlide11
          projectCode={slideData.projectCode}
          title={slideData.title}
          subtitle={slideData.subtitle}
        />
      );
    } else if (slideData.type === "blueprintSpec") {
      SlideEl = (
        <BlueprintSpecSlide11
          title={slideData.title}
          specs={slideData.specs}
        />
      );
    } else if (slideData.type === "blueprintList") {
      SlideEl = (
        <BlueprintListSlide11
          title={slideData.title}
          items={slideData.items}
        />
      );
    } else if (slideData.type === "blueprintQuote") {
      SlideEl = (
        <BlueprintQuoteSlide11
          quote={slideData.quote}
          author={slideData.author}
          role={slideData.role}
        />
      );
    } else if (slideData.type === "blueprintDiagram") {
      SlideEl = (
        <BlueprintDiagramSlide11
          title={slideData.title}
          bars={slideData.bars}
        />
      );
    } else if (slideData.type === "blueprintGrid") {
      SlideEl = (
        <BlueprintGridSlide11
          headline={slideData.headline}
          items={slideData.items}
        />
      );
    } else {
      // blueprintClosing
      SlideEl = (
        <BlueprintClosingSlide11
          projectCode={slideData.projectCode}
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
    <AbsoluteFill style={{ backgroundColor: "#071220" }}>
      <TransitionSeries>{children}</TransitionSeries>
    </AbsoluteFill>
  );
};
