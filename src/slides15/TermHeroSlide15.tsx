// src/slides15/TermHeroSlide15.tsx
// Terminal hero — prompt types command, then output lines, then tagline + blinking cursor

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme15 } from "./theme15";

type Props = {
  command: string;
  output: string[];
  tagline: string;
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

export const TermHeroSlide15: React.FC<Props> = ({ command, output, tagline }) => {
  const frame = useCurrentFrame();

  // Command types in starting frame 5, speed 3
  const cmdTyped = charsAt(command, frame, 5, 3);
  const cmdDone = cmdTyped.length === command.length;

  // Output lines start after command finishes + 10 frame gap
  const cmdFinishFrame = 5 + Math.ceil(command.length / 3);
  const outputStartFrame = cmdFinishFrame + 10;

  // Each output line: determine start frame based on previous line finishing (speed 4)
  const outputLines: string[] = [];
  let currentStart = outputStartFrame;
  const outputStartFrames: number[] = [];
  for (let i = 0; i < output.length; i++) {
    outputStartFrames.push(currentStart);
    const typed = charsAt(output[i], frame, currentStart, 4);
    outputLines.push(typed);
    currentStart += Math.ceil(output[i].length / 4) + 5;
  }

  // Tagline starts after all output finishes
  const taglineStart = currentStart + 8;
  const taglineTyped = charsAt(tagline, frame, taglineStart, 2);
  const taglineDone = taglineTyped.length === tagline.length;
  const allOutputDone = output.every((line, i) => outputLines[i].length === line.length);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme15.bg,
        fontFamily: theme15.mono,
        overflow: "hidden",
      }}
    >
      {/* Terminal header bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundColor: theme15.green,
          opacity: 0.3,
        }}
      />

      {/* Terminal content */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          right: 80,
          bottom: 80,
          fontSize: 28,
          lineHeight: 1.8,
          color: theme15.white,
        }}
      >
        {/* Command line */}
        <div>
          <span style={{ color: theme15.green }}>$ </span>
          <span>{cmdTyped}</span>
          {!cmdDone && <span style={{ color: theme15.green }}>{cursor(frame)}</span>}
        </div>

        {/* Blank line after command (show after command is done) */}
        {cmdDone && <div>&nbsp;</div>}

        {/* Output lines */}
        {cmdDone && outputLines.map((line, i) => (
          <div key={i} style={{ color: theme15.white }}>
            {line}
            {line.length < output[i].length && (
              <span style={{ color: theme15.green }}>{cursor(frame)}</span>
            )}
          </div>
        ))}

        {/* Blank line + tagline after all output */}
        {allOutputDone && outputLines.length > 0 && (
          <>
            <div>&nbsp;</div>
            <div style={{ color: theme15.dim }}>
              {taglineTyped}
              {taglineDone ? (
                <span style={{ color: theme15.green }}>{cursor(frame)}</span>
              ) : (
                <span style={{ color: theme15.green }}>{cursor(frame)}</span>
              )}
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
