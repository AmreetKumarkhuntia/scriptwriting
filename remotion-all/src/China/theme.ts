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

// Semantic data colors (kept separate from the blue brand palette): used to
// highlight meaning in charts/callouts — green = China / cheaper / win,
// red = GPT / expensive / the incumbent to watch.
export const signal = {
  good: "#3DDC97", // green — China / cheaper
  goodDeep: "#1E9E6A",
  bad: "#FF5C6C", // red — GPT / expensive
  badDeep: "#C9384A",
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
  display: bebas.fontFamily, // Bebas Neue — titles, section headers, stats, labels
  body: montserrat.fontFamily, // Montserrat — sub-labels, callouts, captions
} as const;
