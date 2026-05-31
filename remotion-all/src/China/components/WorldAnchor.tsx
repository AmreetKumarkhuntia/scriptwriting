type Props = {
  x: number; // world x (node center)
  y: number; // world y (top of the info column)
  width?: number;
  children: React.ReactNode;
};

// Hangs a lab's info column centered horizontally below its node, in world
// space, so it pans/zooms with the CameraStage.
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
