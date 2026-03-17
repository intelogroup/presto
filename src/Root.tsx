import React from "react";
import { Composition } from "remotion";
import { PanZoomDemo } from "./PanZoomDemo";
import { AdvancedDemo } from "./AdvancedDemo";
import { PresentationDemo } from "./PresentationDemo";
import { ShowcaseDemo } from "./ShowcaseDemo";
import { PictureInPictureDemo } from "./PictureInPictureDemo";

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
        durationInFrames={8470}
        fps={30}
        width={1920}
        height={1080}
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