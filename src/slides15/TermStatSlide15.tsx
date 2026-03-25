// src/slides15/TermStatSlide15.tsx
// Terminal DB query simulation — SELECT query types in, then ASCII table with result + notes

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { theme15 } from "./theme15";

type Props = {
  query: string;
  metricKey: string;
  value: string;
  unit: string;
  notes: string[];
};

function charsAt(text: string, frame: number, startFrame: number, speed = 2): string {
  const elapsed = Math.max(0, frame - startFrame);
  const count = Math.min(text.length, Math.floor(elapsed * speed));
  return text.slice(0, count);
}

function cursor(frame: number): string {
  return Math.floor(frame / 8) % 2 === 0 ? "█" : "";
}

export const TermStatSlide15: React.FC<Props> = ({ query, metricKey, value, unit, notes }) => {
  const frame = useCurrentFrame();

  // Query types in starting frame 5, speed 3
  const queryTyped = charsAt(query, frame, 5, 3);
  const queryDone = queryTyped.length === query.length;
  const queryFinish = 5 + Math.ceil(query.length / 3);

  // Table lines appear after query, typing fast (speed 8)
  const tableStart = queryFinish + 12;
  const topBorder    = "┌─────────────────────┬──────────────────────┐";
  const headerRow    = "│ Metric              │ Value                │";
  const headerSep    = "├─────────────────────┼──────────────────────┤";
  const dataRow      = `│ ${metricKey.padEnd(19)} │ ${(value + " " + unit).padEnd(20)} │`;
  const bottomBorder = "└─────────────────────┴──────────────────────┘";

  const tableLines = [topBorder, headerRow, headerSep, dataRow, bottomBorder];
  const tableDuration = tableLines.map((_, i) => tableStart + i * 8);

  const tableTyped = tableLines.map((line, i) =>
    charsAt(line, frame, tableDuration[i], 12)
  );

  const lastTableFrame = tableDuration[tableDuration.length - 1] + Math.ceil(tableLines[tableLines.length - 1].length / 12);

  // Notes appear after table
  const noteStartBase = lastTableFrame + 10;
  const noteData = notes.map((note, i) => {
    const noteText = `// ${note}`;
    const startF = noteStartBase + i * 14;
    return { text: noteText, typed: charsAt(noteText, frame, startF, 5) };
  });

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
        {/* Query line */}
        <div>
          <span style={{ color: theme15.amber }}>&gt; </span>
          <span style={{ color: theme15.white }}>{queryTyped}</span>
          {!queryDone && (
            <span style={{ color: theme15.green }}>{cursor(frame)}</span>
          )}
        </div>

        {/* Blank line */}
        {queryDone && <div>&nbsp;</div>}

        {/* ASCII table */}
        {tableTyped.map((line, i) => {
          if (frame < tableDuration[i]) return null;
          // Data row: color the value portion green
          if (i === 3) {
            // Split at second │ to highlight value
            const parts = line.split("│");
            return (
              <div key={i} style={{ whiteSpace: "pre" }}>
                {parts.map((part, pi) => {
                  if (pi === 2) {
                    return <span key={pi} style={{ color: theme15.green }}>│{part}</span>;
                  }
                  return <span key={pi} style={{ color: theme15.white }}>{pi > 0 ? "│" : ""}{part}</span>;
                })}
              </div>
            );
          }
          return (
            <div key={i} style={{ color: theme15.white, whiteSpace: "pre" }}>
              {line}
            </div>
          );
        })}

        {/* Blank line + notes */}
        {frame >= lastTableFrame && <div>&nbsp;</div>}
        {noteData.map((note, i) => {
          if (note.typed.length === 0) return null;
          return (
            <div key={i} style={{ color: theme15.dim }}>
              {note.typed}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
