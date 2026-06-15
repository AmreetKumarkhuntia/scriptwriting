import { staticFile } from "remotion";

// Curated SFX for "The AI Bubble", sourced from the user's SFX Pack and copied
// into remotion-all/public/sfx/. Each entry is a logical cue name → file + a
// default volume tuned to sit UNDER the voiceover (clips are dropped over the VO
// in the NLE, so keep these subtle). Override per-use via the <Sfx volume> prop.
export const SFX = {
  whoosh: { src: staticFile("sfx/whoosh.mp3"), volume: 0.45 }, // camera move / transition
  swoosh: { src: staticFile("sfx/swoosh.mp3"), volume: 0.35 }, // title / text reveal
  popIn: { src: staticFile("sfx/pop-in.mp3"), volume: 0.35 }, // bubble appears
  burst: { src: staticFile("sfx/burst.mp3"), volume: 0.75 }, // the outro bubble POP
  ding: { src: staticFile("sfx/ding.mp3"), volume: 0.4 }, // positive / SAFE / win
  alert: { src: staticFile("sfx/alert.mp3"), volume: 0.35 }, // negative / risk / expensive
  riser: { src: staticFile("sfx/riser.wav"), volume: 0.45 }, // build into a re-hook
  riserBig: { src: staticFile("sfx/riser-big.wav"), volume: 0.55 }, // build into the pop
  money: { src: staticFile("sfx/money.mp3"), volume: 0.5 }, // money flow / $ stat
  fire: { src: staticFile("sfx/fire.mp3"), volume: 0.22 }, // burn ambience (loop)
  impact: { src: staticFile("sfx/impact.mp3"), volume: 0.55 }, // stinger on a big reveal
} as const;

export type SfxName = keyof typeof SFX;
