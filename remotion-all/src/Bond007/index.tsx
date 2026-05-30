import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { GunBarrel } from "./GunBarrel";
import { LogoReveal } from "./LogoReveal";
import { BloodWash } from "./BloodWash";
import { TitleCard } from "./TitleCard";
import { Tagline } from "./Tagline";

export const Bond007: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence durationInFrames={4 * fps}>
        <GunBarrel />
      </Sequence>

      <Sequence from={4 * fps} durationInFrames={4 * fps}>
        <LogoReveal />
      </Sequence>

      <Sequence from={7.5 * fps} durationInFrames={3 * fps}>
        <BloodWash />
      </Sequence>

      <Sequence from={8 * fps} durationInFrames={4 * fps}>
        <TitleCard />
      </Sequence>

      <Sequence from={12 * fps} durationInFrames={4 * fps}>
        <Tagline />
      </Sequence>
    </AbsoluteFill>
  );
};
