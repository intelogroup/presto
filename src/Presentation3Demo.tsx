// src/Presentation3Demo.tsx
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";

import { KpiTitleSlide3 } from "./slides3/KpiTitleSlide3";
import { BigStatSlide3 } from "./slides3/BigStatSlide3";
import { MetricRowSlide3 } from "./slides3/MetricRowSlide3";
import { BarRaceSlide3 } from "./slides3/BarRaceSlide3";
import { MilestoneSlide3 } from "./slides3/MilestoneSlide3";
import { theme3 } from "./slides3/theme3";
import { Presentation3Props } from "./schema";
import { TalkingHead } from "./TalkingHead";

const TRANSITIONS = [
  slide({ direction: "from-right" }),
  wipe({ direction: "from-left" }),
  slide({ direction: "from-bottom" }),
  wipe({ direction: "from-right" }),
  slide({ direction: "from-left" }),
  wipe({ direction: "from-bottom" }),
];

export const Presentation3Demo: React.FC<Presentation3Props> = ({
  slides,
  talkingHeadSrc,
  faceTrack,
}) => {
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

    if (slideData.type === "kpiTitle") {
      SlideEl = (
        <KpiTitleSlide3
          title={slideData.title}
          tagline={slideData.tagline}
          badge={slideData.badge}
        />
      );
    } else if (slideData.type === "bigStat") {
      SlideEl = (
        <BigStatSlide3
          label={slideData.label}
          value={slideData.value}
          numericValue={slideData.numericValue}
          unit={slideData.unit}
          trend={slideData.trend}
          caption={slideData.caption}
        />
      );
    } else if (slideData.type === "metricRow") {
      SlideEl = (
        <MetricRowSlide3
          title={slideData.title}
          metrics={slideData.metrics}
        />
      );
    } else if (slideData.type === "barRace") {
      SlideEl = (
        <BarRaceSlide3
          title={slideData.title}
          bars={slideData.bars}
          maxValue={slideData.maxValue}
        />
      );
    } else {
      // milestone
      SlideEl = (
        <MilestoneSlide3
          icon={slideData.icon}
          headline={slideData.headline}
          caption={slideData.caption}
          year={slideData.year}
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

      {/* Talking head circle — bottom right, auto-focuses on speaker's face */}
      {talkingHeadSrc && (
        <TalkingHead src={talkingHeadSrc} faceTrack={faceTrack} borderColor={theme3.green} />
      )}
    </AbsoluteFill>
  );
};
