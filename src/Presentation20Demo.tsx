// src/Presentation20Demo.tsx
// Kinetic Typography presentation — P20
// 2026 trend: text as the star, full-screen bold type, rhythm-driven reveals
// Transitions: none (hard cut for maximum impact, like a music video)

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { KineticSplashSlide20 } from "./slides20/KineticSplashSlide20";
import { KineticRevealSlide20 } from "./slides20/KineticRevealSlide20";
import { KineticQuoteSlide20 } from "./slides20/KineticQuoteSlide20";
import { KineticClosingSlide20 } from "./slides20/KineticClosingSlide20";
import { Presentation20Props, P20Slide } from "./schema";

const TRANSITION_FRAMES = 5;

function renderSlide(s: P20Slide): React.ReactNode {
  switch (s.type) {
    case "kineticSplash":
      return <KineticSplashSlide20 word={s.word} accent={s.accent} />;
    case "kineticReveal":
      return <KineticRevealSlide20 words={s.words} accent={s.accent} />;
    case "kineticQuote20":
      return <KineticQuoteSlide20 quote={s.quote} author={s.author} />;
    case "kineticClosing20":
      return <KineticClosingSlide20 line1={s.line1} line2={s.line2} />;
  }
}

export const Presentation20Demo: React.FC<Presentation20Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
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
