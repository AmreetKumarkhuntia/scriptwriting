import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// GOV-NOIR RED — the AI Kill Switch palette. Matte black government void,
// paper-white documents, ONE blood-red accent (the switch / the state).
// Deliberately NOT the channel's blue: this video is a thriller.
export const noir = {
  void: "#0A0A0C", // world background / letterbox
  coal: "#141418", // panels, monolith faces
  steel: "#26262E", // mid greys, struts, plinths
  smoke: "#4A4A55", // muted lines, inactive strokes
  ash: "#8B8B96", // secondary text, qualifiers
  paper: "#F2EFE9", // documents, headline type
  red: "#E5233D", // THE accent — switch, seals, denial (one per frame)
  redDeep: "#7E1220", // red shadows / afterglow
  ember: "#FF6B5A", // hot core inside red glows (sparingly)
} as const;

const bebas = loadBebas("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const montserrat = loadMontserrat("normal", {
  weights: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const fonts = {
  display: bebas.fontFamily, // Bebas Neue — titles, dates, stamps
  body: montserrat.fontFamily, // Montserrat — sublabels, chips, counters
} as const;

export const FPS = 30;
export const W = 1920;
export const H = 1080;
