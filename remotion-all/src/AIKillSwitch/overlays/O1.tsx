import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, CornerStamp, KeyChip, MotifStrip, R, SectionTag, StripLine } from "./Kit";

// KSO-1 — 810f (27s) @ 0:14. Setup: the letter, the switch, who owns it.
// Local f = (t − 14.0s) × 30.
export const O1: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={8} out={795} />
    <SectionTag at={16} out={792} kicker="KILL SWITCH" label="CASE FILE" />
    {/* date carry-over from the ColdOpen board */}
    <KeyChip at={10} out={190} x={1416} y={120} title="12 JUNE · 5:21 PM" sub="COMMERCE LETTER" />
    {/* 0:21 — the off-switch wasn't for one model */}
    <StripLine at={210} out={450}>
      EK SWITCH — <R>SAARE AI</R>
    </StripLine>
    {/* 0:32.1 — the video's spine, first strike */}
    <MotifStrip at={543} out={700} />
    {/* 0:37.7 — "teen saal se" */}
    <CornerStamp at={711} out={792} text="3 SAAL" x={1520} y={190} />
  </AbsoluteFill>
);
