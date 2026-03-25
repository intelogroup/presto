// src/slides15/TermQuoteSlide15.tsx
// Terminal quote — simulates `cat testimonial.txt` with ASCII box around quote

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme15 } from "./theme15";

type Props = {
  quote: string;
  author: string;
  role?: string;
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

export const TermQuoteSlide15: React.FC<Props> = ({ quote, author, role }) => {
  const frame = useCurrentFrame();

  // Command types in at frame 5
  const cmdText = "cat testimonial.txt";
  const cmdTyped = charsAt(cmdText, frame, 5, 3);
  const cmdDone = cmdTyped.length === cmdText.length;
  const cmdFinish = 5 + Math.ceil(cmdText.length / 3);

  // Box lines appear one by one after command
  const BOX_WIDTH = 50;
  const topLine    = "╔" + "═".repeat(BOX_WIDTH) + "╗";
  const emptyLine  = "║" + " ".repeat(BOX_WIDTH) + "║";
  // Pad quote to fit (truncate if needed)
  const quoteDisplay = `"${quote}"`;
  const quotePadded  = "║  " + quoteDisplay.padEnd(BOX_WIDTH - 2) + "║";
  const authorDisplay = `— ${author}${role ? `, ${role}` : ""}`;
  const authorPadded  = "║  " + authorDisplay.padEnd(BOX_WIDTH - 2) + "║";
  const bottomLine   = "╚" + "═".repeat(BOX_WIDTH) + "╝";

  const boxLines = [
    topLine,
    emptyLine,
    quotePadded,
    emptyLine,
    authorPadded,
    emptyLine,
    bottomLine,
  ];

  const boxStartFrame = cmdFinish + 12;
  const BOX_TYPE_SPEED = 14; // chars per frame (fast)
  const lineStartFrames = boxLines.map((line, i) => {
    return boxStartFrame + i * Math.ceil(line.length / BOX_TYPE_SPEED + 3);
  });

  const boxTyped = boxLines.map((line, i) =>
    charsAt(line, frame, lineStartFrames[i], BOX_TYPE_SPEED)
  );

  const lastLineIdx = boxLines.length - 1;
  const allBoxDone = boxTyped[lastLineIdx].length === boxLines[lastLineIdx].length;

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
          fontSize: 22,
          lineHeight: 1.8,
          color: theme15.white,
        }}
      >
        {/* Command */}
        <div>
          <span style={{ color: theme15.green }}>$ </span>
          <span style={{ color: theme15.white }}>{cmdTyped}</span>
          {!cmdDone && <span style={{ color: theme15.green }}>{cursor(frame)}</span>}
        </div>

        {/* Blank line */}
        {cmdDone && <div>&nbsp;</div>}

        {/* Box lines */}
        {boxTyped.map((line, i) => {
          if (frame < lineStartFrames[i]) return null;
          // Author line: color green
          if (i === 4) {
            return (
              <div key={i} style={{ whiteSpace: "pre", color: theme15.green }}>
                {line}
              </div>
            );
          }
          // Quote line: color white
          return (
            <div key={i} style={{ whiteSpace: "pre", color: theme15.white }}>
              {line}
              {i === lastLineIdx && allBoxDone && (
                <span style={{ color: theme15.green }}>{cursor(frame)}</span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
