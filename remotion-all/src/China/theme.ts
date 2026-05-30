import { loadFont as loadBebas } from "@remotion/google-fonts/BebasNeue";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// Palette from "China takes over AI/theme.md"
export const colors = {
  skyLight: "#ADE1FB", // accents, highlights, Chinese / cheaper side
  blueMed: "#266CA9", // secondary fills, Chinese bars
  royal: "#0F2573", // US / expensive side, mid backgrounds
  navy: "#041D56", // panels, gradient top
  midnight: "#01082D", // base background, gradient bottom
} as const;

// Comparison color convention: Chinese side = skyLight/blueMed, US side = royal/navy.
export const sides = {
  china: colors.skyLight,
  chinaDeep: colors.blueMed,
  us: colors.royal,
  usDeep: colors.navy,
} as const;

const bebas = loadBebas("normal", {
  weights: ["400"],
  subsets: ["latin"],
});

const montserrat = loadMontserrat("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export const fonts = {
  display: bebas.fontFamily, // Bebas Neue — titles, section headers, stats, labels
  body: montserrat.fontFamily, // Montserrat — sub-labels, callouts, captions
} as const;
