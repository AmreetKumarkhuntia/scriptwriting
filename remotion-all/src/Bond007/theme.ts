import { loadFont as loadCinzel } from "@remotion/google-fonts/Cinzel";
import { loadFont as loadMontserrat } from "@remotion/google-fonts/Montserrat";

// Palette matches the existing gun-barrel intro (GunBarrel/LogoReveal/TitleCard):
// spy black + gold, with a single alert-red accent for the villain/combat beats.
export const colors = {
  ink: "#000000", // base background
  gold: "#D4AF37", // brand gold — titles, lines, lower-thirds
  goldSoft: "rgba(212,175,55,0.8)",
  bone: "#F4ECD8", // off-white for body text
  alert: "#D7263D", // red — villain monologue / combat callouts
} as const;

const cinzel = loadCinzel("normal", { weights: ["400", "700", "900"], subsets: ["latin"] });
const montserrat = loadMontserrat("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

export const fonts = {
  display: cinzel.fontFamily, // Cinzel — title cards, act labels (matches intro)
  body: montserrat.fontFamily, // Montserrat — callouts, captions
} as const;
