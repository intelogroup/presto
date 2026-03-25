// src/slides15/TermClosingSlide15.tsx
// Terminal closing — fake log lines scroll, then big message + shell prompt with cursor

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme15 } from "./theme15";

type Props = {
  message: string;
  prompt: string;
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

const FAKE_LOGS = [
  "[INFO]  build pipeline complete — 0 errors",
  "[INFO]  pushing artifact to registry v2.7.1",
  "[INFO]  health checks passed — all systems nominal",
  "[OK]    deployment ready for prod",
];

export const TermClosingSlide15: React.FC<Props> = ({ message, prompt }) => {
  const frame = useCurrentFrame();

  // Fake log lines type in quickly (speed 8) starting frame 5, stagger 12f
  const logData = FAKE_LOGS.map((log, i) => {
    const startF = 5 + i * 12;
    const typed = charsAt(log, frame, startF, 8);
    return { log, typed, startF };
  });

  const lastLogFinish = 5 + (FAKE_LOGS.length - 1) * 12 + Math.ceil(FAKE_LOGS[FAKE_LOGS.length - 1].length / 8);

  // Blank line then message types in slowly
  const messageStart = lastLogFinish + 15;
  const messageTyped = charsAt(message, frame, messageStart, 2);
  const messageDone = messageTyped.length === message.length;
  const messageFinish = messageStart + Math.ceil(message.length / 2);

  // Prompt types in after message
  const promptStart = messageFinish + 15;
  const promptTyped = charsAt(prompt, frame, promptStart, 3);

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
        }}
      >
        {/* Fake log lines */}
        <div style={{ fontSize: 20, lineHeight: 1.7, color: theme15.dim }}>
          {logData.map((log, i) => {
            if (log.typed.length === 0) return null;
            return (
              <div key={i}>{log.typed}</div>
            );
          })}
        </div>

        {/* Blank line */}
        {frame >= lastLogFinish && (
          <div style={{ fontSize: 20 }}>&nbsp;</div>
        )}

        {/* Main message — large, green */}
        {frame >= messageStart && (
          <div
            style={{
              fontSize: 36,
              lineHeight: 1.5,
              color: theme15.green,
              fontFamily: theme15.mono,
              marginTop: 20,
            }}
          >
            {messageTyped}
            {!messageDone && <span>{cursor(frame)}</span>}
          </div>
        )}

        {/* Blank line */}
        {messageDone && (
          <div style={{ fontSize: 36 }}>&nbsp;</div>
        )}

        {/* Shell prompt */}
        {frame >= promptStart && (
          <div
            style={{
              fontSize: 28,
              lineHeight: 1.8,
              color: theme15.white,
              fontFamily: theme15.mono,
            }}
          >
            <span style={{ color: theme15.green }}>$ </span>
            <span>{promptTyped}</span>
            <span style={{ color: theme15.green }}>{cursor(frame)}</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
