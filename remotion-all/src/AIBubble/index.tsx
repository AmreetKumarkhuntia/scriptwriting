import { Composition } from "remotion";
import { AIBubbleHook } from "./clips/AIBubbleHook";
import { AIBubbleSection1 } from "./clips/AIBubbleSection1";
import { AIBubbleSection2 } from "./clips/AIBubbleSection2";
import { AIBubbleSection3 } from "./clips/AIBubbleSection3";
import { AIBubbleSection4 } from "./clips/AIBubbleSection4";
import { AIBubbleSection5 } from "./clips/AIBubbleSection5";
import { AIBubbleSection6 } from "./clips/AIBubbleSection6";

// Standalone motion-graphics clips for "The AI Bubble" (Hindi/Hinglish cut).
// Apple-white minimal look; a virtual camera flies over an AI-economy plane.
// Each clip drops onto the NLE timeline over the recorded audio. 1920x1080 @
// 30fps. Durations are pinned to captions.md cue ranges.
export const AIBubbleCompositions: React.FC = () => {
  return (
    <>
      {/* HOOK — THE GAP · cues 1–11 · 0:00–0:27 */}
      <Composition
        id="AIBubble-Hook"
        component={AIBubbleHook}
        durationInFrames={807}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 1 — THE SUBSIDY · cues 12–30 · 0:27–1:15 */}
      <Composition
        id="AIBubble-Section1"
        component={AIBubbleSection1}
        durationInFrames={1456}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 2 — THE CHINA PROBLEM · cues 31–46 · 1:15–1:58 */}
      <Composition
        id="AIBubble-Section2"
        component={AIBubbleSection2}
        durationInFrames={1267}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 3 — THE BURN · cues 47–62 · 1:58–2:36 */}
      <Composition
        id="AIBubble-Section3"
        component={AIBubbleSection3}
        durationInFrames={1148}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 4 — THE PARALLEL · cues 63–73 · 2:36–3:02 */}
      <Composition
        id="AIBubble-Section4"
        component={AIBubbleSection4}
        durationInFrames={777}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 5 — THE VERDICT · cues 74–89 · 3:02–3:40 */}
      <Composition
        id="AIBubble-Section5"
        component={AIBubbleSection5}
        durationInFrames={1142}
        fps={30}
        width={1920}
        height={1080}
      />

      {/* SECTION 6 — OUTRO · cues 90–94 · 3:40–3:52 */}
      <Composition
        id="AIBubble-Section6"
        component={AIBubbleSection6}
        durationInFrames={363}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
