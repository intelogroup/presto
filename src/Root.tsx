import React from "react";
import { Composition } from "remotion";
import { PanZoomDemo } from "./PanZoomDemo";
import { AdvancedDemo } from "./AdvancedDemo";
import { PresentationDemo } from "./PresentationDemo";
import { Presentation2Demo } from "./Presentation2Demo";
import { ShowcaseDemo } from "./ShowcaseDemo";
import { PictureInPictureDemo } from "./PictureInPictureDemo";
import { Presentation1PropsSchema, Presentation2PropsSchema, Presentation3PropsSchema } from "./schema";
import { DEFAULT_P1_SLIDES, DEFAULT_P2_SLIDES, DEFAULT_P3_SLIDES } from "./defaultProps";
import { Presentation3Demo } from "./Presentation3Demo";

const TRANSITION_FRAMES = 20;

function calcDuration(slides: Array<{ duration: number }>): number {
  const total = slides.reduce((sum, s) => sum + s.duration, 0);
  const transitionOverlap = Math.max(0, slides.length - 1) * TRANSITION_FRAMES;
  return total - transitionOverlap;
}

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PanZoom"
        component={PanZoomDemo}
        durationInFrames={120}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Advanced"
        component={AdvancedDemo}
        durationInFrames={210}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Presentation"
        component={PresentationDemo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation1PropsSchema}
        defaultProps={{
          logoSrc: "google.png",
          talkingHeadSrc: "talkinghead_clean.mp4",
          slides: DEFAULT_P1_SLIDES,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: calcDuration(props.slides),
        })}
      />
      <Composition
        id="Presentation2"
        component={Presentation2Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation2PropsSchema}
        defaultProps={{ slides: DEFAULT_P2_SLIDES }}
        calculateMetadata={({ props }) => ({
          durationInFrames: calcDuration(props.slides),
        })}
      />
      <Composition
        id="Presentation3"
        component={Presentation3Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation3PropsSchema}
        defaultProps={{
          talkingHeadSrc: "talkinghead_clean.mp4",
          slides: DEFAULT_P3_SLIDES,
        }}
        calculateMetadata={({ props }) => ({
          durationInFrames: calcDuration(props.slides),
        })}
      />
      <Composition
        id="Showcase"
        component={ShowcaseDemo}
        // Duration: 120 + 120 + 90 - 20 - 15 = 295 frames
        durationInFrames={295}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PictureInPicture"
        component={PictureInPictureDemo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};