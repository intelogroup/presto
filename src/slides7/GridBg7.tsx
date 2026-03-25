// Reusable grid background for P7 slides
import React from "react";
import { theme7 } from "./theme7";

export const GridBg7: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      backgroundImage: `linear-gradient(${theme7.gridLine} 1px, transparent 1px), linear-gradient(90deg, ${theme7.gridLine} 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
    }}
  />
);
