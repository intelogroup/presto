// src/Presentation19Demo.tsx
// Data Infographic presentation — P19
// 2026 trend: animated counters, bar charts, donut charts, clean data visualization
// Transitions: slide from-bottom, 10 frames (data panel reveal)

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { DataHeroSlide19 } from "./slides19/DataHeroSlide19";
import { DataCounterSlide19 } from "./slides19/DataCounterSlide19";
import { DataBarSlide19 } from "./slides19/DataBarSlide19";
import { DataDonutSlide19 } from "./slides19/DataDonutSlide19";
import { DataClosingSlide19 } from "./slides19/DataClosingSlide19";
import { Presentation19Props, P19Slide } from "./schema";

const TRANSITION_FRAMES = 10;

function renderSlide(s: P19Slide): React.ReactNode {
  switch (s.type) {
    case "dataHero":
      return <DataHeroSlide19 title={s.title} subtitle={s.subtitle} badge={s.badge} />;
    case "dataCounter":
      return <DataCounterSlide19 value={s.value} suffix={s.suffix} label={s.label} sublabel={s.sublabel} />;
    case "dataBar":
      return <DataBarSlide19 title={s.title} bars={s.bars} />;
    case "dataDonut":
      return <DataDonutSlide19 title={s.title} segments={s.segments} centerValue={s.centerValue} centerLabel={s.centerLabel} />;
    case "dataClosing":
      return <DataClosingSlide19 headline={s.headline} tagline={s.tagline} />;
  }
}

export const Presentation19Demo: React.FC<Presentation19Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0f1729" }}>
      <TransitionSeries>
        {slides.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s.duration}>
              <AbsoluteFill>{renderSlide(s)}</AbsoluteFill>
            </TransitionSeries.Sequence>
            {i < slides.length - 1 && (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-bottom" })}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
