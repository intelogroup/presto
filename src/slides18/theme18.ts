// src/slides18/theme18.ts
// Grunge / Textured Raw — 2026 trend: raw, imperfect, film-grain, tape marks
export const theme18 = {
  bg: "#1a1a18",             // dark warm charcoal
  paper: "#f0ebe0",          // aged paper / cream
  rust: "#c44d28",           // burnt rust orange
  mustard: "#d4a843",        // distressed mustard
  ink: "#1a1a18",            // near-black ink
  chalk: "#e8e2d4",          // chalk white
  red: "#b93232",            // faded red
  display: "'Impact', 'Arial Black', 'Helvetica Neue', sans-serif",
  body: "'Courier New', 'Courier', monospace",
  // Film grain noise overlay
  grain: {
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.15'/%3E%3C/svg%3E")`,
    backgroundSize: "256px 256px",
  },
  // Tape strip styling
  tape: {
    backgroundColor: "rgba(210, 195, 160, 0.55)",
    transform: "rotate(-2deg)",
    padding: "4px 24px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
  },
};
