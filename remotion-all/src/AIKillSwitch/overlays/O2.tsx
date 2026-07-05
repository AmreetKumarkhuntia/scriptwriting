import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, CornerStamp, R, SectionTag, StripLine } from "./Kit";

// KSO-2 — 375f (12.5s) @ 0:51. Setup tail → rewind into Beat 1.
// Local f = (t − 51.0s) × 30.
export const O2: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={360} />
    <SectionTag at={12} out={356} kicker="CASE 01" label="72 GHANTE" />
    {/* 0:53 — switch off, or control */}
    <StripLine at={60} out={280}>
      SWITCH OFF — <R>YA CONTROL</R>
    </StripLine>
    {/* 1:01 — rewind 72 hours */}
    <CornerStamp at={299} out={356} text="72 GHANTE PEECHE" x={1290} y={180} size={54} />
  </AbsoluteFill>
);
