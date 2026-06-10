import { loadFont as loadFraunces } from "@remotion/google-fonts/Fraunces";
import { loadFont as loadSpaceGrotesk } from "@remotion/google-fonts/SpaceGrotesk";
import { loadFont as loadIBMPlexMono } from "@remotion/google-fonts/IBMPlexMono";

// Palette for "Fable 5" — Anthropic's warm-ivory editorial look. A cream paper
// ground, warm-ink text, and the Claude "clay/coral" as the single hero accent,
// with muted earth secondaries. Color stays calm — the hero (Fable 5) renders in
// clay, the rivals (GPT-5.5 / Gemini / Opus) in muted slate. A deliberate
// departure from the dark/neon China + AIJobs palettes.
export const colors = {
  paper: "#F0EEE6", // cream ground
  paperDeep: "#E7E3D7", // panels, cards, vignette edge
  paperEdge: "#DAD5C6", // hairline borders on cream
  ink: "#1A1915", // headlines, body — warm near-black
  inkSoft: "#6B675E", // qualifiers, sub-labels, muted captions
  clay: "#CC785C", // hero accent — Claude clay/coral (Fable 5)
  clayDeep: "#A85A42", // clay shadow / pressed / gradient bottom
  kraft: "#D4A27F", // secondary warm tone
  slate: "#6A7B8A", // rival bars / numbers (dusty blue)
  slateDeep: "#4C5965", // rival shadow / gradient bottom
  sage: "#B5BFA6", // tertiary muted green
} as const;

// Semantic data colors. Unlike the green/red of the other videos, this video is
// "Fable 5 vs the field": the hero is always clay, rivals are slate, with kraft
// as a warm tertiary. `good`/`bad` aliases keep the craft-guide vocabulary.
export const signal = {
  hero: colors.clay,
  heroDeep: colors.clayDeep,
  rival: colors.slate,
  rivalDeep: colors.slateDeep,
  warm: colors.kraft,
  good: colors.clay, // alias — "the win" side
  bad: colors.slate, // alias — the incumbent / rival side
} as const;

// Two-side convention (kept for parity with China/AIJobs `sides`): the "win"
// side is clay (Fable 5), the incumbent side is slate.
export const sides = {
  hero: colors.clay,
  heroDeep: colors.clayDeep,
  rival: colors.slate,
  rivalDeep: colors.slateDeep,
} as const;

const fraunces = loadFraunces("normal", {
  weights: ["400", "500", "600", "700", "900"],
  subsets: ["latin"],
});

// True italic Fraunces (not synthesized) — used sparingly for editorial accents
// like the outro's "For now."
const frauncesItalic = loadFraunces("italic", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

const spaceGrotesk = loadSpaceGrotesk("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const ibmPlexMono = loadIBMPlexMono("normal", {
  weights: ["400", "500", "600"],
  subsets: ["latin"],
});

export const fonts = {
  display: fraunces.fontFamily, // Fraunces serif — headlines, hero lines, big numbers
  displayItalic: frauncesItalic.fontFamily, // Fraunces italic — sparing editorial accents
  label: spaceGrotesk.fontFamily, // Space Grotesk — labels, UI, tracked sub-lines
  mono: ibmPlexMono.fontFamily, // IBM Plex Mono — benchmark numerals, prices, tokens
} as const;
