import "./index.css";
import { Composition } from "remotion";
import { Bond007 } from "./Bond007";
import { ChinaCompositions } from "./China";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Bond007"
        component={Bond007}
        durationInFrames={480}
        fps={30}
        width={1920}
        height={1080}
      />
      <ChinaCompositions />
    </>
  );
};
