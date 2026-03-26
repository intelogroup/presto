// src/Presentation17Demo.tsx — Prestige Academic theme
import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

import { TitleSlide17 } from "./slides17/TitleSlide17";
import { PillarsSlide17 } from "./slides17/PillarsSlide17";
import { ProfSlide17 } from "./slides17/ProfSlide17";
import { ManifestoSlide17 } from "./slides17/ManifestoSlide17";
import { ExpectSlide17 } from "./slides17/ExpectSlide17";
import { CTASlide17 } from "./slides17/CTASlide17";
import { theme17 } from "./slides17/theme17";
import { Presentation17Props } from "./schema";
import { TalkingHead } from "./TalkingHead";

// IMPORTANT: TransitionSeries children must be a flat array — no React.Fragment wrappers.

export const Presentation17Demo: React.FC<Presentation17Props> = ({ slides, talkingHeadSrc, faceTrack }) => {
  const children: React.ReactElement[] = [];

  slides.forEach((slideData, i) => {
    if (i > 0) {
      children.push(
        <TransitionSeries.Transition
          key={`t-${i}`}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          presentation={fade() as any}
          timing={linearTiming({ durationInFrames: 20 })}
        />
      );
    }

    let content: React.ReactElement;

    if (slideData.type === "title17") {
      content = (
        <TitleSlide17
          title={slideData.title}
          subtitle={slideData.subtitle}
          course={slideData.course}
        />
      );
    } else if (slideData.type === "pillars17") {
      content = <PillarsSlide17 title={slideData.title} pillars={slideData.pillars} />;
    } else if (slideData.type === "prof17") {
      content = (
        <ProfSlide17
          name={slideData.name}
          role={slideData.role}
          background={slideData.background}
        />
      );
    } else if (slideData.type === "manifesto17") {
      content = <ManifestoSlide17 statement={slideData.statement} detail={slideData.detail} />;
    } else if (slideData.type === "expect17") {
      content = <ExpectSlide17 title={slideData.title} items={slideData.items} />;
    } else {
      // cta17
      content = <CTASlide17 headline={slideData.headline} instruction={slideData.instruction} />;
    }

    children.push(
      <TransitionSeries.Sequence key={`s-${i}`} durationInFrames={slideData.duration}>
        {content}
      </TransitionSeries.Sequence>
    );
  });

  return (
    <AbsoluteFill>
      <TransitionSeries>{children}</TransitionSeries>

      {/* Talking head circle — bottom right, auto-focuses on speaker's face */}
      {talkingHeadSrc && (
        <TalkingHead src={talkingHeadSrc} faceTrack={faceTrack} borderColor="#38bdf8" />
      )}
    </AbsoluteFill>
  );
};
