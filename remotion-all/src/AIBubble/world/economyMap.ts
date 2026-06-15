import { Cam, WORLD_CX, WORLD_CY } from "../components/CameraStage";

// Shared world-coordinate layout for the AI-economy map. Sections are separate
// compositions, but they share this coordinate system so the camera language is
// consistent: the Hook flies IN toward the gap and the Outro pulls OUT to the
// whole map — making the seven clips read as one continuous plane.

// Whole-map establishing shot (everything in frame).
export const WIDE: Cam = { cx: WORLD_CX, cy: WORLD_CY, z: 0.5 };

// Frame a world point at a given zoom. `dy` nudges the framing so a content
// column hanging below the point stays on screen.
export const focus = (x: number, y: number, z = 1.1, dy = 0): Cam => ({
  cx: x,
  cy: y + dy,
  z,
});

// Survivor-map node anchors (Section 5). Laid out across the plane so the camera
// can fly between them; "safe" players cluster left/center, the at-risk OpenAI
// sits apart on the right, and the doomed application layer sits low.
export type MapNode = { id: string; x: number; y: number; r: number };

export const SURVIVORS: Record<string, MapNode> = {
  nvidia: { id: "nvidia", x: 900, y: 640, r: 230 },
  cloud: { id: "cloud", x: 1600, y: 560, r: 210 },
  anthropic: { id: "anthropic", x: 1280, y: 1140, r: 190 },
  openai: { id: "openai", x: 2380, y: 860, r: 210 },
  apps: { id: "apps", x: 1950, y: 1320, r: 130 },
} as const;
