// src/Presentation16Demo.tsx
// Comic Book / Halftone presentation — P16
// Transitions: slide from-right, 10 frames (snappy panel flip)

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { ComicHeroSlide16 } from "./slides16/ComicHeroSlide16";
import { ComicStatSlide16 } from "./slides16/ComicStatSlide16";
import { ComicSplitSlide16 } from "./slides16/ComicSplitSlide16";
import { ComicListSlide16 } from "./slides16/ComicListSlide16";
import { ComicQuoteSlide16 } from "./slides16/ComicQuoteSlide16";
import { ComicStatsGridSlide16 } from "./slides16/ComicStatsGridSlide16";
import { ComicClosingSlide16 } from "./slides16/ComicClosingSlide16";
import { Presentation16Props, P16Slide } from "./schema";

const TRANSITION_FRAMES = 10;

function renderSlide(s: P16Slide): React.ReactNode {
  switch (s.type) {
    case "comicHero":
      return <ComicHeroSlide16 action={s.action} hero={s.hero} tagline={s.tagline} />;
    case "comicStat":
      return <ComicStatSlide16 label={s.label} value={s.value} exclamation={s.exclamation} color={s.color} />;
    case "comicSplit":
      return <ComicSplitSlide16 panel1={s.panel1} panel2={s.panel2} versus={s.versus} />;
    case "comicList":
      return <ComicListSlide16 title={s.title} items={s.items} />;
    case "comicQuote":
      return <ComicQuoteSlide16 quote={s.quote} author={s.author} role={s.role} />;
    case "comicStatsGrid":
      return <ComicStatsGridSlide16 headline={s.headline} stats={s.stats} />;
    case "comicClosing":
      return <ComicClosingSlide16 action={s.action} tagline={s.tagline} cta={s.cta} />;
  }
}

export const Presentation16Demo: React.FC<Presentation16Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#FAFAFA" }}>
      <TransitionSeries>
        {slides.map((s, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={s.duration}>
              <AbsoluteFill>{renderSlide(s)}</AbsoluteFill>
            </TransitionSeries.Sequence>
            {i < slides.length - 1 && (
              <TransitionSeries.Transition
                presentation={slide({ direction: "from-right" })}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
