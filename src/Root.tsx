import React from "react";
import { Composition } from "remotion";
import { PanZoomDemo } from "./PanZoomDemo";
import { AdvancedDemo } from "./AdvancedDemo";
import { PresentationDemo } from "./PresentationDemo";
import { Presentation2Demo } from "./Presentation2Demo";
import { ShowcaseDemo } from "./ShowcaseDemo";
import { PictureInPictureDemo } from "./PictureInPictureDemo";
import { Presentation1PropsSchema, Presentation2PropsSchema, Presentation3PropsSchema, Presentation4PropsSchema, Presentation5PropsSchema, Presentation6PropsSchema, Presentation7PropsSchema, Presentation8PropsSchema, Presentation9PropsSchema, Presentation10PropsSchema, Presentation11PropsSchema, Presentation12PropsSchema, Presentation13PropsSchema, Presentation14PropsSchema, Presentation15PropsSchema, Presentation16PropsSchema, Presentation17PropsSchema } from "./schema";
import { DEFAULT_P1_SLIDES, DEFAULT_P2_SLIDES, DEFAULT_P3_SLIDES, DEFAULT_P4_SLIDES, DEFAULT_P5_SLIDES, DEFAULT_P6_SLIDES, DEFAULT_P7_SLIDES, DEFAULT_P8_SLIDES, DEFAULT_P9_SLIDES, DEFAULT_P10_SLIDES, DEFAULT_P11_SLIDES, DEFAULT_P12_SLIDES, DEFAULT_P13_SLIDES, DEFAULT_P14_SLIDES, DEFAULT_P15_SLIDES, DEFAULT_P16_SLIDES, DEFAULT_P17_SLIDES } from "./defaultProps";
import { Presentation3Demo } from "./Presentation3Demo";
import { Presentation4Demo } from "./Presentation4Demo";
import { Presentation5Demo } from "./Presentation5Demo";
import { Presentation6Demo } from "./Presentation6Demo";
import { Presentation7Demo } from "./Presentation7Demo";
import { Presentation8Demo } from "./Presentation8Demo";
import { Presentation9Demo } from "./Presentation9Demo";
import { Presentation10Demo } from "./Presentation10Demo";
import { Presentation11Demo } from "./Presentation11Demo";
import { Presentation12Demo } from "./Presentation12Demo";
import { Presentation13Demo } from "./Presentation13Demo";
import { Presentation14Demo } from "./Presentation14Demo";
import { Presentation16Demo } from "./Presentation16Demo";
import { Presentation15Demo } from "./Presentation15Demo";
import { Presentation17Demo } from "./Presentation17Demo";

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
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 10;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation4"
        component={Presentation4Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation4PropsSchema}
        defaultProps={{ slides: DEFAULT_P4_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 10;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation5"
        component={Presentation5Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation5PropsSchema}
        defaultProps={{ slides: DEFAULT_P5_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 15;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation6"
        component={Presentation6Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation6PropsSchema}
        defaultProps={{ slides: DEFAULT_P6_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 20;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation7"
        component={Presentation7Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation7PropsSchema}
        defaultProps={{ slides: DEFAULT_P7_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 8;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation8"
        component={Presentation8Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation8PropsSchema}
        defaultProps={{ slides: DEFAULT_P8_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 15;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation9"
        component={Presentation9Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation9PropsSchema}
        defaultProps={{ slides: DEFAULT_P9_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 12;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation10"
        component={Presentation10Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation10PropsSchema}
        defaultProps={{ slides: DEFAULT_P10_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 18;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation11"
        component={Presentation11Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation11PropsSchema}
        defaultProps={{ slides: DEFAULT_P11_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 10;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation12"
        component={Presentation12Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation12PropsSchema}
        defaultProps={{ slides: DEFAULT_P12_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 8;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation13"
        component={Presentation13Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation13PropsSchema}
        defaultProps={{ slides: DEFAULT_P13_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 15;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation14"
        component={Presentation14Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation14PropsSchema}
        defaultProps={{ slides: DEFAULT_P14_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 20;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation15"
        component={Presentation15Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation15PropsSchema}
        defaultProps={{ slides: DEFAULT_P15_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 3;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation16"
        component={Presentation16Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation16PropsSchema}
        defaultProps={{ slides: DEFAULT_P16_SLIDES }}
        calculateMetadata={({ props }) => {
          const total = props.slides.reduce((sum, s) => sum + s.duration, 0);
          const overlap = Math.max(0, props.slides.length - 1) * 10;
          return { durationInFrames: total - overlap };
        }}
      />
      <Composition
        id="Presentation17"
        component={Presentation17Demo}
        fps={30}
        width={1920}
        height={1080}
        schema={Presentation17PropsSchema}
        defaultProps={{ slides: DEFAULT_P17_SLIDES, talkingHeadSrc: "talkinghead_clean.mp4" }}
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