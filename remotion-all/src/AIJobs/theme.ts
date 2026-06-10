import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";
import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";

// Palette for "AI Jobs Fear" — a dark, high-contrast scheme: deep ink/indigo
// background, white display text, with an electric cyan accent and a violet
// secondary. Key names mirror China/theme.ts so the shared component library
// works unchanged — only the values differ.
export const colors = {
  skyLight: "#6EE7F9", // electric cyan — accents, highlights, "with AI" / win-adjacent
  blueMed: "#A78BFA", // violet — secondary fills, dot grid, soft accents
  royal: "#1E2A4A", // indigo panels, mid backgrounds
  navy: "#0B1226", // gradient top
  midnight: "#04060E", // base background, gradient bottom, vignette
} as const;

// Two-side comparison convention (used by VersusSplit / charts):
// "good" side (with AI / safe / created) = cyan-green; "bad" side = rose.
export const sides = {
  china: colors.skyLight, // kept name for component compatibility — the "win" side
  chinaDeep: colors.blueMed,
  us: colors.royal, // the "lose" / incumbent side
  usDeep: colors.navy,
} as const;

// Semantic data colors (kept separate from the brand palette). Repurposed for
// this video: green = jobs created / safe / "with AI"; red = jobs displaced /
// fear / "without AI"; amber = a small/partial slice (e.g. "only 8–10%").
export const signal = {
  good: "#34D399", // emerald — created / safe / win
  goodDeep: "#1A7F5A",
  bad: "#FB7185", // rose — displaced / fear / lose
  badDeep: "#B23A4E",
  warn: "#FBBF24", // amber — partial slice
  warnDeep: "#B7811A",
} as const;

const bebas = loadBebas("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const montserrat = loadMontserrat("normal", {
  weights: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const anton = loadAnton("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

export const fonts = {
  display: bebas.fontFamily, // Bebas Neue — titles, section headers, stats, labels
  body: montserrat.fontFamily, // Montserrat — sub-labels, callouts, captions
  impact: anton.fontFamily, // Anton — heavy hook slams, max-impact one-liners
} as const;
