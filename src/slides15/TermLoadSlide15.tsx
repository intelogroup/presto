// src/slides15/TermLoadSlide15.tsx
// Terminal loading/install simulation — steps with [..] → [OK] status + animated progress bar

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme15 } from "./theme15";

type Step = { text: string; done: boolean };

type Props = {
  label: string;
  steps: Step[];
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

export const TermLoadSlide15: React.FC<Props> = ({ label, steps }) => {
  const frame = useCurrentFrame();

  // Label types in at frame 5, speed 3
  const labelTyped = charsAt(label, frame, 5, 3);
  const labelDone = labelTyped.length === label.length;

  // Steps stagger: step 0 at frame 15, step 1 at 35, step 2 at 55, etc.
  const STEP_START_FRAMES = steps.map((_, i) => 15 + i * 20);

  // Status bracket timing: text finishes then 15 frames later flip to [OK]/[!!]
  const stepData = steps.map((step, i) => {
    const startFrame = STEP_START_FRAMES[i];
    const typed = charsAt(step.text, frame, startFrame, 4);
    const textFinishFrame = startFrame + Math.ceil(step.text.length / 4);
    const statusFlipFrame = textFinishFrame + 15;
    const flipped = frame >= statusFlipFrame;
    return { typed, flipped, step, startFrame };
  });

  // Progress bar: animate after all step text is visible
  const lastStepStart = STEP_START_FRAMES[steps.length - 1] ?? 15;
  const progressStart = lastStepStart + 30;
  // Count how many steps are done
  const doneCount = stepData.filter((d) => d.flipped && d.step.done).length;
  const totalSteps = steps.length;
  const progressFraction = totalSteps > 0 ? doneCount / totalSteps : 0;

  // Animate ▓ count from 0 to max*progressFraction over 30 frames after progressStart
  const BAR_WIDTH = 20;
  const progressElapsed = Math.max(0, frame - progressStart);
  const progressAnim = Math.min(1, progressElapsed / 30);
  const filledCount = Math.round(progressAnim * progressFraction * BAR_WIDTH);
  const emptyCount = BAR_WIDTH - filledCount;
  const barStr = "▓".repeat(filledCount) + "░".repeat(emptyCount);
  const pct = Math.round(progressAnim * progressFraction * 100);

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

      <div
        style={{
          position: "absolute",
          top: 80,
          left: 80,
          right: 80,
          bottom: 80,
          fontSize: 24,
          lineHeight: 1.8,
          color: theme15.white,
        }}
      >
        {/* Label title */}
        <div style={{ color: theme15.amber }}>
          {labelTyped}
          {!labelDone && <span>{cursor(frame)}</span>}
        </div>

        {/* Blank line */}
        {labelDone && <div>&nbsp;</div>}

        {/* Steps */}
        {labelDone && stepData.map(({ typed, flipped, step, startFrame }, i) => {
          if (frame < startFrame) return null;
          let bracket: React.ReactNode;
          if (!flipped) {
            bracket = (
              <span style={{ color: theme15.dim }}>[..]</span>
            );
          } else if (step.done) {
            bracket = (
              <span style={{ color: theme15.green }}>[OK]</span>
            );
          } else {
            bracket = (
              <span style={{ color: theme15.error }}>[!!]</span>
            );
          }
          return (
            <div key={i}>
              {bracket}
              <span style={{ color: theme15.white }}> {typed}</span>
              {typed.length < step.text.length && (
                <span style={{ color: theme15.green }}>{cursor(frame)}</span>
              )}
            </div>
          );
        })}

        {/* Progress bar — show after progressStart */}
        {frame >= progressStart && (
          <>
            <div>&nbsp;</div>
            <div>
              <span style={{ color: theme15.white }}>Progress: [</span>
              <span style={{ color: theme15.green }}>{barStr}</span>
              <span style={{ color: theme15.white }}>] </span>
              <span style={{ color: theme15.amber }}>{pct}%</span>
            </div>
          </>
        )}
      </div>
    </AbsoluteFill>
  );
};
