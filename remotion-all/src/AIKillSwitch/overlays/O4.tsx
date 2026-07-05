import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, CornerStamp, DocChip, KeyChip, R, SectionTag, StripLine } from "./Kit";

// KSO-4 — 570f (19s) @ 2:08.5. Anthropic refuses, the government reaches for
// a 2018 law. Local f = (t − 128.5s) × 30.
export const O4: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={558} />
    <SectionTag at={12} out={554} kicker="CASE 02" label="ANDAR SE CALL" />
    {/* 2:08.6 — Anthropic ne mana kar diya */}
    <CornerStamp at={20} out={150} text="REFUSED" x={1520} y={160} />
    {/* 2:11.1 — their own review */}
    <KeyChip at={78} out={225} x={1416} y={330} title={'FLAW: "MINOR"'} sub="ANTHROPIC KI REVIEW" />
    {/* 2:13.9 — replicates on public models */}
    <KeyChip at={162} out={310} x={64} y={560} title="GPT-5.5 PE BHI" sub="REPLICATE HOTA HAI" w={400} />
    {/* 2:16.4 — the punch */}
    <StripLine at={237} out={392}>
      GOVERNMENT NE <R>KHUD HATA DIYA</R>
    </StripLine>
    {/* 2:19.2 — the tool they picked up */}
    <DocChip at={321} out={545} x={1480} y={130} title="2018 KA KANOON" tag="EXPORT LAW" />
    {/* 2:22 — never built for this */}
    <StripLine at={405} out={545} size={42}>
      IS KAAM KE LIYE <R>BANA HI NAHI THA</R>
    </StripLine>
  </AbsoluteFill>
);
