// src/PresentationDemo.tsx
import React from "react";
import { AbsoluteFill, Img, OffthreadVideo, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";

import { TitleSlide } from "./slides/TitleSlide";
import { ImageSlide } from "./slides/ImageSlide";
import { ChecklistSlide } from "./slides/ChecklistSlide";
import { StatsSlide } from "./slides/StatsSlide";
import { IconGridSlide } from "./slides/IconGridSlide";
import { BarChartSlide } from "./slides/BarChartSlide";
import { TimelineSlide } from "./slides/TimelineSlide";
import { QuoteSlide } from "./slides/QuoteSlide";
import { IconFeaturesSlide } from "./slides/IconFeaturesSlide";
import { theme } from "./slides/theme";
import { Presentation1Props } from "./schema";

// ─── Composition ──────────────────────────────────────────────────────────────
// IMPORTANT: TransitionSeries children must be a FLAT array.
// React.Fragment wrappers break TransitionSeries internal child traversal.

export const PresentationDemo: React.FC<Presentation1Props> = ({ slides, logoSrc, talkingHeadSrc }) => {
  const transitionList = [
    fade(),
    wipe({ direction: "from-left" }),
    flip(),
    clockWipe({ width: 1920, height: 1080 }),
    slide({ direction: "from-top" }),
    fade(),
    wipe({ direction: "from-right" }),
    slide({ direction: "from-right" }),
    flip(),
    clockWipe({ width: 1920, height: 1080 }),
    fade(),
    slide({ direction: "from-left" }),
    flip(),
    wipe({ direction: "from-left" }),
    fade(),
    clockWipe({ width: 1920, height: 1080 }),
  ];

  const timelineChildren: React.ReactElement[] = [];

  slides.forEach((slideData, index) => {
    const transition = index === 0 ? null : transitionList[index % transitionList.length];

    if (transition) {
      timelineChildren.push(
        <TransitionSeries.Transition
          key={`t-${index}`}
          // `as any` required: @remotion/transitions does not export a unified
          // presentation union type — each factory (fade/wipe/flip/etc.) returns
          // a distinct opaque object. Cast is safe; Remotion validates at render time.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={transition as any}
          timing={linearTiming({ durationInFrames: 20 })}
        />
      );
    }

    let SlideComponent: React.ReactElement;

    if (slideData.type === "title") {
      SlideComponent = <TitleSlide title={slideData.title} subtitle={slideData.subtitle} />;
    } else if (slideData.type === "image") {
      SlideComponent = <ImageSlide title={slideData.title} src={slideData.src} duration={slideData.duration} />;
    } else if (slideData.type === "checklist") {
      SlideComponent = <ChecklistSlide title={slideData.title} points={slideData.points} duration={slideData.duration} />;
    } else if (slideData.type === "stats") {
      SlideComponent = <StatsSlide title={slideData.title} stats={slideData.stats} />;
    } else if (slideData.type === "iconGrid") {
      SlideComponent = <IconGridSlide title={slideData.title} items={slideData.items} />;
    } else if (slideData.type === "barChart") {
      SlideComponent = <BarChartSlide title={slideData.title} bars={slideData.bars} />;
    } else if (slideData.type === "timeline") {
      SlideComponent = <TimelineSlide title={slideData.title} milestones={slideData.milestones} />;
    } else if (slideData.type === "quote") {
      SlideComponent = <QuoteSlide quote={slideData.quote} author={slideData.author} role={slideData.role} />;
    } else {
      // iconFeatures
      SlideComponent = <IconFeaturesSlide title={slideData.title} features={slideData.features} />;
    }

    timelineChildren.push(
      <TransitionSeries.Sequence key={`s-${index}`} durationInFrames={slideData.duration}>
        {SlideComponent}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>
        {timelineChildren}
      </TransitionSeries>

      {/* Logo — top right (optional) */}
      {logoSrc && (
        <AbsoluteFill style={{ justifyContent: "flex-start", alignItems: "flex-end", padding: 40, pointerEvents: "none" }}>
          <Img src={staticFile(logoSrc)} style={{ width: 120, objectFit: "contain" }} />
        </AbsoluteFill>
      )}

      {/* Talking head circle — bottom right, looping (optional) */}
      {talkingHeadSrc && (
        <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "flex-end", padding: 60, pointerEvents: "none" }}>
          <div style={{ width: 300, height: 300, borderRadius: "50%", overflow: "hidden", border: `6px solid ${theme.primary}`, boxShadow: "0 10px 30px rgba(0,0,0,0.5)", backgroundColor: "black" }}>
            <OffthreadVideo
              loop
              src={staticFile(talkingHeadSrc)}
              startFrom={30}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
