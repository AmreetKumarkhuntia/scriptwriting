import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// Palette for Amreet Aint gaming shorts — high-contrast overlay text that
// reads over busy gameplay + facecam footage. Red = rage/alert reactions,
// gold = hype/win reactions. Bone = the text fill.
export const colors = {
  bone: "#F6F4EF", // text fill
  ink: "#07070B", // box background base
  alert: "#FF3B30", // rage / "what the hell" red
  gold: "#FFC531", // hype / win yellow
} as const;

const anton = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
const montserrat = loadMontserrat("normal", {
  weights: ["600", "700", "800"],
  subsets: ["latin"],
});

export const fonts = {
  impact: anton.fontFamily, // Anton — heavy uppercase reaction slams
  body: montserrat.fontFamily, // Montserrat — sub-labels
} as const;
