import { staticFile } from "remotion";

// Cue names → files in remotion-all/public/sfx. Volumes tuned to sit UNDER the
// talking-head VO these clips get dropped onto in Resolve. The wav stings
// (hook-boom / card-pop / timeline-rise / hook-whoosh) come from the video-edit
// skill's library; the rest are the shared AIBubble pool.
export const SFX = {
  boom: { src: staticFile("sfx/hook-boom.wav"), volume: 0.6 }, // breaker slam / blackout
  whoosh: { src: staticFile("sfx/hook-whoosh.wav"), volume: 0.4 }, // camera flight
  swoosh: { src: staticFile("sfx/swoosh.mp3"), volume: 0.35 }, // text reveal
  pop: { src: staticFile("sfx/card-pop.wav"), volume: 0.4 }, // chip / label lands
  rise: { src: staticFile("sfx/timeline-rise.wav"), volume: 0.45 }, // build across a move
  flare: { src: staticFile("sfx/flare-hit.mp3"), volume: 0.5 }, // ignition / lights back
  impact: { src: staticFile("sfx/impact.mp3"), volume: 0.55 }, // stamp slam / big reveal
  alert: { src: staticFile("sfx/alert.mp3"), volume: 0.35 }, // DENIED / restriction
  riser: { src: staticFile("sfx/riser.wav"), volume: 0.45 }, // re-hook build
  riserBig: { src: staticFile("sfx/riser-big.wav"), volume: 0.55 }, // showstopper build
} as const;

export type SfxName = keyof typeof SFX;
