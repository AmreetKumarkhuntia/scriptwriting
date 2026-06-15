import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";

// Palette for "The AI Bubble" — an Apple-white minimal look. A near-white plane
// the camera flies over, generous negative space, ink-on-white type, and ONE
// bold accent per scene (color is a highlight, never the theme). A deliberate
// departure from the dark/neon China + AIJobs palettes and the warm Fable5 cream.
export const colors = {
  paper: "#FFFFFF", // ground / plane
  paperDeep: "#F2F3F5", // panels, vignette edge, plane gradient bottom
  paperEdge: "#E6E8EC", // hairline borders, dot grid
  ink: "#111114", // headlines, body, hero numbers
  inkSoft: "#6E7178", // qualifiers, sub-labels, muted captions

  blue: "#2563EB", // accent — verify / structure / neutral analysis
  blueDeep: "#1D4FD8",
  coral: "#FF3B5C", // accent — expensive / risk / the burn / pop
  coralDeep: "#E11D48",
  green: "#10B981", // accent — cheap / safe / win
  greenDeep: "#059669",
  amber: "#F59E0B", // accent — warning / burn
  amberDeep: "#D97706",
} as const;

// Semantic data colors. good = cheap / safe / win (green); bad = expensive /
// risk (coral); warn = burn / caution (amber); neutral = structure (blue).
export const signal = {
  good: colors.green,
  goodDeep: colors.greenDeep,
  bad: colors.coral,
  badDeep: colors.coralDeep,
  warn: colors.amber,
  warnDeep: colors.amberDeep,
  neutral: colors.blue,
  neutralDeep: colors.blueDeep,
} as const;

// Two-side convention (parity with China/AIJobs `sides`): the "win" side is the
// cheaper/safer green, the incumbent / expensive side is coral.
export const sides = {
  cheap: colors.green,
  cheapDeep: colors.greenDeep,
  expensive: colors.coral,
  expensiveDeep: colors.coralDeep,
} as const;

const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = loadInter("normal", {
  weights: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const ibmPlexMono = loadIBMPlexMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const fonts = {
  display: spaceGrotesk.fontFamily, // Space Grotesk — headlines, hero numbers, labels
  body: inter.fontFamily, // Inter — sub-labels, callouts, captions
  mono: ibmPlexMono.fontFamily, // IBM Plex Mono — prices, token counts, ratios
} as const;
