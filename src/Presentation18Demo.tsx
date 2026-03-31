// src/Presentation18Demo.tsx
// Grunge / Textured Raw presentation — P18
// 2026 trend: raw imperfect aesthetics, film grain, tape marks, distressed typography
// Transitions: fade, 12 frames (rough dissolve feel)

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { GrungeHeroSlide18 } from "./slides18/GrungeHeroSlide18";
import { GrungeStatSlide18 } from "./slides18/GrungeStatSlide18";
import { GrungeListSlide18 } from "./slides18/GrungeListSlide18";
import { GrungeQuoteSlide18 } from "./slides18/GrungeQuoteSlide18";
import { GrungeClosingSlide18 } from "./slides18/GrungeClosingSlide18";
import { Presentation18Props, P18Slide } from "./schema";

const TRANSITION_FRAMES = 12;

function renderSlide(s: P18Slide): React.ReactNode {
  switch (s.type) {
    case "grungeHero":
      return <GrungeHeroSlide18 title={s.title} subtitle={s.subtitle} tag={s.tag} />;
    case "grungeStat":
      return <GrungeStatSlide18 value={s.value} label={s.label} context={s.context} />;
    case "grungeList":
      return <GrungeListSlide18 title={s.title} items={s.items} />;
    case "grungeQuote":
      return <GrungeQuoteSlide18 quote={s.quote} author={s.author} role={s.role} />;
    case "grungeClosing":
      return <GrungeClosingSlide18 word={s.word} tagline={s.tagline} />;
  }
}

export const Presentation18Demo: React.FC<Presentation18Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#1a1a18" }}>
      <TransitionSeries>
        {slides.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s.duration}>
              <AbsoluteFill>{renderSlide(s)}</AbsoluteFill>
            </TransitionSeries.Sequence>
            {i < slides.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
