// src/Presentation2Demo.tsx
// "The AI Revolution: By The Numbers" — Editorial Magazine style
// Contrasts with PresentationDemo's dark tech look:
//   — Warm cream/near-black split palette
//   — Georgia serif + Courier New mono typography
//   — Typewriter text, animated number counters, SVG slash, staggered grids
//   — No talking-head overlay

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

import { SplitTitleSlide2 } from "./slides2/SplitTitleSlide2";
import { TypewriterSlide2 } from "./slides2/TypewriterSlide2";
import { BigNumberSlide2 } from "./slides2/BigNumberSlide2";
import { MagazineGridSlide2 } from "./slides2/MagazineGridSlide2";
import { PullQuoteSlide2 } from "./slides2/PullQuoteSlide2";
import { SplitStatsSlide2 } from "./slides2/SplitStatsSlide2";
import { Presentation2Props } from "./schema";

// ─── Composition ──────────────────────────────────────────────────────────────

export const Presentation2Demo: React.FC<Presentation2Props> = ({ slides }) => {
  const transitionList = [
    fade(), wipe({ direction: "from-right" }),
    slide({ direction: "from-bottom" }), wipe({ direction: "from-left" }),
    flip(), slide({ direction: "from-right" }),
    clockWipe({ width: 1920, height: 1080 }), fade(),
    slide({ direction: "from-top" }), wipe({ direction: "from-right" }),
    flip(), fade(), slide({ direction: "from-bottom" }),
    wipe({ direction: "from-left" }), clockWipe({ width: 1920, height: 1080 }),
    slide({ direction: "from-top" }),
  ];

  const timelineChildren: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    const transition = index === 0 ? null : transitionList[index % transitionList.length];

    if (transition) {
      timelineChildren.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={transition as any}
          timing={linearTiming({ durationInFrames: 20 })}
        />
      );
    }

    let SlideComponent: React.ReactElement;

    if (slideData.type === "splitTitle") {
      SlideComponent = (
        <SplitTitleSlide2 title={slideData.title} subtitle={slideData.subtitle} tag={slideData.tag} />
      );
    } else if (slideData.type === "typewriter") {
      SlideComponent = (
        <TypewriterSlide2 text={slideData.text} author={slideData.author} typingEndFrame={slideData.typingEndFrame} />
      );
    } else if (slideData.type === "bigNumber") {
      SlideComponent = (
        <BigNumberSlide2
          value={slideData.value}
          decimals={slideData.decimals}
          prefix={slideData.prefix}
          suffix={slideData.suffix}
          label={slideData.label}
          sublabel={slideData.sublabel}
          dark={slideData.dark}
        />
      );
    } else if (slideData.type === "magazineGrid") {
      SlideComponent = (
        <MagazineGridSlide2 headline={slideData.headline} items={slideData.items} />
      );
    } else if (slideData.type === "pullQuote") {
      SlideComponent = (
        <PullQuoteSlide2 quote={slideData.quote} author={slideData.author} role={slideData.role} />
      );
    } else {
      // splitStats
      SlideComponent = (
        <SplitStatsSlide2 title={slideData.title} stats={slideData.stats} />
      );
    }

    timelineChildren.push(
      <TransitionSeries.Sequence key={`s-${index}`} durationInFrames={slideData.duration}>
        {SlideComponent}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>{timelineChildren}</TransitionSeries>
    </AbsoluteFill>
  );
};
