import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, CornerStamp, QuoteCard, R, SectionTag, StripLine } from "./Kit";

// KSO-6 — 771f (25.7s) @ 3:26.3. The irony beat: their own safety pitch became
// the lever. Local f = (t − 206.3s) × 30.
export const O6: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={756} />
    <SectionTag at={12} out={752} kicker="CASE 04" label="IRONY" />
    {/* 3:29.4 — the brand line, in full */}
    <QuoteCard
      at={93}
      out={362}
      x={64}
      y={560}
      quote="Humein regulate karo — AI bahut khatarnak hai."
      who="Anthropic ki brand line"
    />
    {/* 3:33.9 — that line became the lever */}
    <StripLine at={228} out={362}>
      WAHI LINE → <R>LEVER BAN GAYI</R>
    </StripLine>
    {/* 3:38.8 — armed the switch-pressers */}
    <StripLine at={375} out={512} size={40}>
      SAFETY NE BACHAYA NAHI — <R>HATHIYAR DE DIYA</R>
    </StripLine>
    {/* 3:44 — the turn */}
    <StripLine at={531} out={682}>
      SWITCH <R>WAPAS ON</R> KAISE HUA?
    </StripLine>
    {/* 3:49.6 — pre-lap into the SwitchBack spine */}
    <CornerStamp at={699} out={752} text="19 DIN" x={1540} y={170} />
  </AbsoluteFill>
);
