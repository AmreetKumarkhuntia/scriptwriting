type Props = {
  x: number; // world x (station center)
  y: number; // world y (top of the content column)
  width?: number;
  children: React.ReactNode;
};

// Hangs a content column centered horizontally at a world point, in world space,
// so it pans/zooms with the CameraStage.
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
