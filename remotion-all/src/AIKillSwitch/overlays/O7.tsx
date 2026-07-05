import React from "react";
import { AbsoluteFill } from "remotion";
import { CaseFrame, KeyChip, R, SectionTag, StrikeLine, StripLine } from "./Kit";

// KSO-7 — 1185f (39.5s) @ 4:04. The comeback terms + the target moves to
// OpenAI. Local f = (t − 244.0s) × 30.
export const O7: React.FC = () => (
  <AbsoluteFill>
    <CaseFrame at={6} out={1170} />
    <SectionTag at={12} out={1166} kicker="CASE 05" label="WAPSI" />
    {/* 4:05.5 — the patch */}
    <KeyChip at={45} out={200} x={1416} y={120} title="NAYA CLASSIFIER" sub="99%+ CASES BLOCK" />
    {/* 4:08.3 — the terms */}
    <KeyChip at={129} out={300} x={1416} y={262} title="GOVT TERMS" sub="MAAN LIYE" />
    {/* 4:10.7 — Mythos still gated */}
    <KeyChip at={201} out={340} x={1416} y={404} title="MYTHOS 5" sub="SIRF ~10 US GOV ORGS" />
    {/* 4:15.6 — the punch of the whole beat */}
    <StripLine at={348} out={562} size={44}>
      OFF: <R>WASHINGTON</R> · ON: <R>WASHINGTON</R> — DONO BAAR
    </StripLine>
    {/* 4:23.6 — not a one-off */}
    <StrikeLine
      at={588}
      strikeAt={615}
      replaceAt={624}
      out={715}
      from="ONE-TIME STORY?"
      to="NAHI."
      cx={1560}
      y={210}
      size={44}
    />
    {/* 4:26 — the pivot */}
    <KeyChip at={660} out={780} x={64} y={560} title="DO HAFTE BAAD" sub="NAYA TARGET" w={380} />
    {/* 4:28.5 — date / actor / target cascade */}
    <KeyChip at={735} out={1010} x={1416} y={120} title="25 JUNE" w={420} />
    <KeyChip at={780} out={1010} x={1416} y={240} title="WHITE HOUSE" w={420} />
    <KeyChip at={819} out={1010} x={1416} y={360} title="→ OPENAI" accent w={420} />
    {/* 4:34.1 / 4:37.1 — the models */}
    <KeyChip at={903} out={1100} x={64} y={560} title="GPT-5.6" w={340} />
    <KeyChip at={993} out={1100} x={64} y={690} title="SOL · TERRA · LUNA" sub="CODENAMES" w={420} />
    {/* 4:39.8 — the ask */}
    <StripLine at={1074} out={1166}>
      SIRF <R>TRUSTED PARTNERS</R> TAK
    </StripLine>
  </AbsoluteFill>
);
