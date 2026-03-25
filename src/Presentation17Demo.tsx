// src/Presentation17Demo.tsx — Prestige Academic theme
import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";
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

// IMPORTANT: TransitionSeries children must be a flat array — no React.Fragment wrappers.

export const Presentation17Demo: React.FC<Presentation17Props> = ({ slides, talkingHeadSrc }) => {
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

      {/* Talking head circle — bottom right, looping (optional) */}
      {talkingHeadSrc && (
        <AbsoluteFill
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            padding: 60,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              width: 300,
              height: 300,
              borderRadius: "50%",
              overflow: "hidden",
              border: "6px solid #38bdf8",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              backgroundColor: "black",
            }}
          >
            {/* @ts-ignore loop is valid at runtime but missing from OffthreadVideo types in this version */}
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
