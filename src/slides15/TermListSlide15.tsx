// src/slides15/TermListSlide15.tsx
// Terminal list — simulates `cat README.md` output with markdown header and bullet items

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme15 } from "./theme15";

type Props = {
  heading: string;
  items: string[];
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

export const TermListSlide15: React.FC<Props> = ({ heading, items }) => {
  const frame = useCurrentFrame();

  // Command: `$ cat {heading}.md` types in at frame 5, speed 3
  const cmdText = `cat ${heading}.md`;
  const cmdTyped = charsAt(cmdText, frame, 5, 3);
  const cmdDone = cmdTyped.length === cmdText.length;
  const cmdFinish = 5 + Math.ceil(cmdText.length / 3);

  // Heading line: `# {heading}` appears after command + 12 frames
  const headingStart = cmdFinish + 12;
  const headingText = `# ${heading}`;
  const headingTyped = charsAt(headingText, frame, headingStart, 5);
  const headingDone = headingTyped.length === headingText.length;
  const headingFinish = headingStart + Math.ceil(headingText.length / 5);

  // Items type in sequentially
  let currentStart = headingFinish + 8;
  const itemData = items.map((item) => {
    const itemText = `- ${item}`;
    const startF = currentStart;
    const typed = charsAt(itemText, frame, startF, 4);
    currentStart += Math.ceil(itemText.length / 4) + 6;
    return { itemText, typed, startF };
  });

  const lastItem = itemData[itemData.length - 1];
  const allDone = lastItem ? lastItem.typed.length === lastItem.itemText.length : false;

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
        {/* Command */}
        <div>
          <span style={{ color: theme15.green }}>$ </span>
          <span style={{ color: theme15.white }}>{cmdTyped}</span>
          {!cmdDone && <span style={{ color: theme15.green }}>{cursor(frame)}</span>}
        </div>

        {/* Blank line */}
        {cmdDone && <div>&nbsp;</div>}

        {/* Markdown heading */}
        {frame >= headingStart && (
          <div style={{ color: theme15.amber }}>
            {headingTyped}
          </div>
        )}

        {/* Blank line after heading */}
        {headingDone && <div>&nbsp;</div>}

        {/* Items */}
        {itemData.map((item, i) => {
          if (frame < item.startF) return null;
          const isLast = i === itemData.length - 1;
          const isDone = item.typed.length === item.itemText.length;
          return (
            <div key={i} style={{ color: theme15.white }}>
              {item.typed}
              {(!isDone || (isLast && !allDone)) && (
                <span style={{ color: theme15.green }}>{cursor(frame)}</span>
              )}
              {isLast && allDone && (
                <span style={{ color: theme15.green }}>{cursor(frame)}</span>
              )}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
