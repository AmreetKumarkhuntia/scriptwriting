import {
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fonts, signal } from "../theme";

type Side = {
  title: string; // e.g. "WITHOUT AI"
  sub?: string; // e.g. "falling behind"
};

type Props = {
  left: Side; // the "lose" side — rendered red
  right: Side; // the "win" side — rendered green
  startDelay?: number;
  width?: number; // total width of the split block
  height?: number;
};

// A left/right split panel comparing two labeled sides: the left slides in from
// the left as the red "lose" side, the right slides in from the right as the
// green "win" side, and a "VS" badge pops in the middle. Used for
// "WITHOUT AI vs WITH AI" beats.
export const VersusSplit: React.FC<Props> = ({
  left,
  right,
  startDelay = 0,
  width = 1500,
  height = 560,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panel = (i: number) =>
    spring({
      frame: frame - (startDelay + i * 8),
      fps,
      config: { damping: 200 },
      durationInFrames: 22,
    });
  const vs = spring({
    frame: frame - (startDelay + 18),
    fps,
    config: { damping: 11, stiffness: 130 },
    durationInFrames: 20,
  });

  const Card: React.FC<{
    side: Side;
    color: string;
    deep: string;
    fromX: number;
    p: number;
  }> = ({ side, color, deep, fromX, p }) => (
    <div
      style={{
        flex: 1,
        height,
        opacity: interpolate(p, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(p, [0, 1], [fromX, 0])}px)`,
        borderRadius: 24,
        border: `2px solid ${color}66`,
        background: `linear-gradient(160deg, ${deep}55 0%, ${deep}11 100%)`,
        boxShadow: `0 0 60px ${color}22, inset 0 0 60px ${color}11`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 22,
        padding: 40,
      }}
    >
      <div
        style={{
          fontFamily: fonts.display,
          fontSize: 120,
          lineHeight: 0.95,
          letterSpacing: 2,
          color,
          textAlign: "center",
          textShadow: `0 0 40px ${color}55`,
        }}
      >
        {side.title}
      </div>
      {side.sub ? (
        <div
          style={{
            fontFamily: fonts.body,
            fontWeight: 400,
            fontSize: 34,
            letterSpacing: 1,
            color: "#C7D3E6",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          {side.sub}
        </div>
      ) : null}
    </div>
  );

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 80,
        width,
      }}
    >
      <Card
        side={left}
        color={signal.bad}
        deep={signal.badDeep}
        fromX={-120}
        p={panel(0)}
      />
      <Card
        side={right}
        color={signal.good}
        deep={signal.goodDeep}
        fromX={120}
        p={panel(1)}
      />

      {/* Center VS badge */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(vs, [0, 1], [0.4, 1])})`,
          opacity: interpolate(vs, [0, 1], [0, 1]),
          width: 130,
          height: 130,
          borderRadius: "50%",
          background: "#04060E",
          border: "3px solid #FFFFFF",
          boxShadow: "0 0 50px #6EE7F988",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: fonts.impact,
          fontSize: 64,
          color: "#FFFFFF",
          letterSpacing: 2,
        }}
      >
        VS
      </div>
    </div>
  );
};
