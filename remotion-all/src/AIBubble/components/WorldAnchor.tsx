type Props = {
  x: number; // world x (anchor center)
  y: number; // world y (top of the content column)
  width?: number;
  children: React.ReactNode;
};

// Hangs a column of content centered horizontally on a world point, in world
// space, so it pans/zooms with the CameraStage. Ported from src/China.
export const WorldAnchor: React.FC<Props> = ({ x, y, width = 900, children }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      transform: "translateX(-50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);
