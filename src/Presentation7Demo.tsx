// "Neon Grid / Cyber" — near-black bg, cyan/magenta neons, monospace, grid lines, terminal aesthetic
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { wipe } from "@remotion/transitions/wipe";

import { CyberHeroSlide7 } from "./slides7/CyberHeroSlide7";
import { CyberMetricsSlide7 } from "./slides7/CyberMetricsSlide7";
import { CyberBarSlide7 } from "./slides7/CyberBarSlide7";
import { CyberListSlide7 } from "./slides7/CyberListSlide7";
import { CyberQuoteSlide7 } from "./slides7/CyberQuoteSlide7";
import { CyberClosingSlide7 } from "./slides7/CyberClosingSlide7";
import { CyberLineChartSlide7 } from "./slides7/CyberLineChartSlide7";
import { CyberIconGridSlide7 } from "./slides7/CyberIconGridSlide7";

// ── Types ───────────────────────────────────────────────────────────────────

type CyberHeroSlide = {
  type: "cyberHero";
  duration: number;
  title: string;
  subtitle: string;
  systemLabel: string;
};

type CyberMetricsSlide = {
  type: "cyberMetrics";
  duration: number;
  title: string;
  metrics: Array<{
    value: string;
    label: string;
    delta?: string;
    accent: "cyan" | "magenta" | "green";
  }>;
};

type CyberBarSlide = {
  type: "cyberBar";
  duration: number;
  title: string;
  bars: Array<{ label: string; value: number }>;
};

type CyberListSlide = {
  type: "cyberList";
  duration: number;
  title: string;
  items: string[];
};

type CyberQuoteSlide = {
  type: "cyberQuote";
  duration: number;
  quote: string;
  author: string;
  role?: string;
};

type CyberClosingSlide = {
  type: "cyberClosing";
  duration: number;
  word: string;
  tagline: string;
};

type CyberLineChartSlide = {
  type: "cyberLineChart";
  duration: number;
  title: string;
  points: Array<{ label: string; value: number }>;
  yLabel?: string;
  accent: "cyan" | "magenta" | "green";
};

type CyberIconGridSlide = {
  type: "cyberIconGrid";
  duration: number;
  title: string;
  items: Array<{
    iconName: string;
    label: string;
    value?: string;
    accent: "cyan" | "magenta" | "green";
  }>;
};

export type Presentation7Props = {
  slides: Array<
    | CyberHeroSlide
    | CyberMetricsSlide
    | CyberBarSlide
    | CyberListSlide
    | CyberQuoteSlide
    | CyberClosingSlide
    | CyberLineChartSlide
    | CyberIconGridSlide
  >;
};

// ── Component ────────────────────────────────────────────────────────────────

const TRANSITION_DURATION = 8;

export const Presentation7Demo: React.FC<Presentation7Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#050510" }}>
      <TransitionSeries>
        {slides.map((slide, index) => {
          const isLast = index === slides.length - 1;

          return (
            <React.Fragment key={index}>
              <TransitionSeries.Sequence durationInFrames={slide.duration}>
                {slide.type === "cyberHero" && (
                  <CyberHeroSlide7
                    title={slide.title}
                    subtitle={slide.subtitle}
                    systemLabel={slide.systemLabel}
                  />
                )}
                {slide.type === "cyberMetrics" && (
                  <CyberMetricsSlide7
                    title={slide.title}
                    metrics={slide.metrics}
                  />
                )}
                {slide.type === "cyberBar" && (
                  <CyberBarSlide7
                    title={slide.title}
                    bars={slide.bars}
                  />
                )}
                {slide.type === "cyberList" && (
                  <CyberListSlide7
                    title={slide.title}
                    items={slide.items}
                  />
                )}
                {slide.type === "cyberQuote" && (
                  <CyberQuoteSlide7
                    quote={slide.quote}
                    author={slide.author}
                    role={slide.role}
                  />
                )}
                {slide.type === "cyberClosing" && (
                  <CyberClosingSlide7
                    word={slide.word}
                    tagline={slide.tagline}
                  />
                )}
                {slide.type === "cyberLineChart" && (
                  <CyberLineChartSlide7
                    title={slide.title}
                    points={slide.points}
                    yLabel={slide.yLabel}
                    accent={slide.accent}
                  />
                )}
                {slide.type === "cyberIconGrid" && (
                  <CyberIconGridSlide7
                    title={slide.title}
                    items={slide.items}
                  />
                )}
              </TransitionSeries.Sequence>

              {!isLast && (
                <TransitionSeries.Transition
                  presentation={wipe({ direction: "from-right" })}
                  timing={linearTiming({ durationInFrames: TRANSITION_DURATION })}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
