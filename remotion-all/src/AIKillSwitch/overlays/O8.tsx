import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, CornerStamp, R, SectionTag, StripLine } from "./Kit";

// KSO-8 — 405f (13.5s) @ 4:52.5. Exception → pattern, and the tease of the
// untouchable AI. Local f = (t − 292.5s) × 30.
export const O8: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={392} />
    <SectionTag at={12} out={388} kicker="CASE 05" label="PATTERN" />
    {/* 4:57.6 — it's a pattern now */}
    <CornerStamp at={153} out={280} text="PATTERN" x={1510} y={160} />
    {/* 5:00.3 — the tease into Swarm */}
    <StripLine at={234} out={388} size={42}>
      EK AI — JISE SWITCH <R>CHHU BHI NAHI SAKTI</R>
    </StripLine>
  </AbsoluteFill>
);
