// Running order for the 007 First Light — Day 3 highlight reel.
// Each entry maps to a cut clip in remotion-all/public/007clips/ (symlinked to F).
//
// Boundaries are CLEAN SCENE UNITS (start at the first line, end after the final
// thought); near-adjacent beats are merged into one continuous clip. Clips play
// as HARD CUTS — no transitions in Remotion (fades/transitions are added later in
// DaVinci). `frames` = floor(actualSeconds * 30) - 1 (matches the ffmpeg cut).

export type ReelClip = {
  file: string; // filename under public/007clips/
  frames: number; // Sequence duration (clip-local)
  beat: string; // human label (docs only)
  src: string; // source span in the VOD (docs only)
  lowerThird?: { label: string; sub?: string }; // act card on the first ~70 frames
  callout?: { text: string; at: number; tone?: "gold" | "alert" }; // reaction pop
};

export const CLIPS: ReelClip[] = [
  { file: "02_briefing.mp4", frames: 5189, beat: "Briefing + arrival", src: "16:07-19:00",
    lowerThird: { label: "The Mission", sub: "Find Agent 009" } },
  { file: "03_market_exec.mp4", frames: 7919, beat: "Market brawl + execution (full kill)", src: "22:48-27:12",
    lowerThird: { label: "Al Lef", sub: "City of Steel & Sand" } },
  { file: "04_fightpit.mp4", frames: 3419, beat: "Fight pit — Omar", src: "42:08-44:02",
    lowerThird: { label: "The Fight Pit" } },
  { file: "05_auction.mp4", frames: 5579, beat: "Auction setup", src: "1:11:24-1:14:30",
    lowerThird: { label: "The Auction", sub: "Bids Bound by Blood" } },
  { file: "06_auction_coup.mp4", frames: 7169, beat: "Auction climax + coup + 009 location", src: "1:17:13-1:21:12",
    callout: { text: "We sold Greenway 😅", at: 2520 } },
  { file: "07_firefight.mp4", frames: 10619, beat: "Port firefight (full)", src: "1:39:08-1:45:02",
    lowerThird: { label: "The Port" } },
  { file: "08_boat.mp4", frames: 7529, beat: "Beckett's boat — the reveal", src: "1:55:24-1:59:35",
    lowerThird: { label: "009", sub: "The Trail Ends" } },
  { file: "09_betrayal.mp4", frames: 13259, beat: "Capture + betrayal + pit + escape + closer", src: "2:00:16-2:07:38",
    lowerThird: { label: "The Trap" },
    callout: { text: "Greenway, WAKE UP!", at: 7500, tone: "alert" } },
];

// Cold-open hook: a short dramatic teaser clip then a hard cut to the title slam.
export const TEASER_FILE = "00_teaser.mp4"; // ~the "Now, you die" betrayal beat
export const TEASER_FRAMES = 160; // ~5.3s
export const TITLE_FRAMES = 80; // ~2.6s title slam
export const OUTRO_FRAMES = 120;

// All segments are hard cuts (no transition overlap), so the total is a plain sum.
export const reelDurationInFrames = (): number =>
  TEASER_FRAMES + TITLE_FRAMES + OUTRO_FRAMES + CLIPS.reduce((s, c) => s + c.frames, 0);
