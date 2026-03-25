// "Cinematic Gold" — near-black bg, warm gold accents, serif typography, luxury pitch deck
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { Presentation6Props } from "./schema";
import { CinemaHeroSlide6 } from "./slides6/CinemaHeroSlide6";
import { CinemaStatSlide6 } from "./slides6/CinemaStatSlide6";
import { CinemaGridSlide6 } from "./slides6/CinemaGridSlide6";
import { CinemaQuoteSlide6 } from "./slides6/CinemaQuoteSlide6";
import { CinemaListSlide6 } from "./slides6/CinemaListSlide6";
import { CinemaClosingSlide6 } from "./slides6/CinemaClosingSlide6";
import { CinemaImageFullSlide6 } from "./slides6/CinemaImageFullSlide6";
import { CinemaIconRowSlide6 } from "./slides6/CinemaIconRowSlide6";

const TRANSITION_FRAMES = 20;

export const Presentation6Demo: React.FC<Presentation6Props> = ({ slides }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
      <TransitionSeries>
        {slides.map((slide, i) => {
          const isLast = i === slides.length - 1;

          const content = (() => {
            switch (slide.type) {
              case "cinemaHero":
                return (
                  <CinemaHeroSlide6
                    chapter={slide.chapter}
                    title={slide.title}
                    subtitle={slide.subtitle}
                  />
                );
              case "cinemaStat":
                return (
                  <CinemaStatSlide6
                    label={slide.label}
                    value={slide.value}
                    sublabel={slide.sublabel}
                    context={slide.context}
                  />
                );
              case "cinemaGrid":
                return (
                  <CinemaGridSlide6
                    headline={slide.headline}
                    columns={slide.columns}
                  />
                );
              case "cinemaQuote":
                return (
                  <CinemaQuoteSlide6
                    quote={slide.quote}
                    author={slide.author}
                    role={slide.role}
                  />
                );
              case "cinemaList":
                return (
                  <CinemaListSlide6
                    title={slide.title}
                    items={slide.items}
                  />
                );
              case "cinemaClosing":
                return (
                  <CinemaClosingSlide6
                    word={slide.word}
                    tagline={slide.tagline}
                  />
                );
              case "cinemaImageFull":
                return (
                  <CinemaImageFullSlide6
                    src={slide.src}
                    title={slide.title}
                    caption={slide.caption}
                    overlay={slide.overlay}
                  />
                );
              case "cinemaIconRow":
                return (
                  <CinemaIconRowSlide6
                    headline={slide.headline}
                    items={slide.items}
                  />
                );
              default:
                return null;
            }
          })();

          return (
            <React.Fragment key={i}>
              <TransitionSeries.Sequence durationInFrames={slide.duration}>
                <AbsoluteFill style={{ backgroundColor: "#0A0A0A" }}>
                  {content}
                </AbsoluteFill>
              </TransitionSeries.Sequence>
              {!isLast && (
                <TransitionSeries.Transition
                  timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
                  presentation={fade()}
                />
              )}
            </React.Fragment>
          );
        })}
      </TransitionSeries>
    </AbsoluteFill>
  );
};
