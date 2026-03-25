// src/Presentation15Demo.tsx
// P15 Terminal / CLI — hard-cut transitions (3-frame fade flash)
// All slides simulate a command-line interface on a near-black terminal background

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { TermHeroSlide15 } from "./slides15/TermHeroSlide15";
import { TermLoadSlide15 } from "./slides15/TermLoadSlide15";
import { TermStatSlide15 } from "./slides15/TermStatSlide15";
import { TermListSlide15 } from "./slides15/TermListSlide15";
import { TermQuoteSlide15 } from "./slides15/TermQuoteSlide15";
import { TermBarChartSlide15 } from "./slides15/TermBarChartSlide15";
import { TermClosingSlide15 } from "./slides15/TermClosingSlide15";
import { Presentation15Props, P15Slide } from "./schema";

type Props = Presentation15Props;

const TRANSITION_FRAMES = 3;

function renderSlide(slide: P15Slide): React.ReactNode {
  switch (slide.type) {
    case "termHero":
      return (
        <TermHeroSlide15
          command={slide.command}
          output={slide.output}
          tagline={slide.tagline}
        />
      );
    case "termLoad":
      return (
        <TermLoadSlide15
          label={slide.label}
          steps={slide.steps}
        />
      );
    case "termStat": {
      const { key: metricKey, ...rest } = slide;
      return (
        <TermStatSlide15
          query={rest.query}
          metricKey={metricKey}
          value={rest.value}
          unit={rest.unit}
          notes={rest.notes}
        />
      );
    }
    case "termList":
      return (
        <TermListSlide15
          heading={slide.heading}
          items={slide.items}
        />
      );
    case "termQuote":
      return (
        <TermQuoteSlide15
          quote={slide.quote}
          author={slide.author}
          role={slide.role}
        />
      );
    case "termBar":
      return (
        <TermBarChartSlide15
          title={slide.title}
          bars={slide.bars}
        />
      );
    case "termClosing":
      return (
        <TermClosingSlide15
          message={slide.message}
          prompt={slide.prompt}
        />
      );
    default:
      return null;
  }
}

export const Presentation15Demo: React.FC<Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0C0C" }}>
      <TransitionSeries>
        {slides.map((slide, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={slide.duration}>
              {renderSlide(slide)}
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
