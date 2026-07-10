import "./index.css";
import { Bond007Compositions } from "./Bond007";
import { ChinaCompositions } from "./China";
import { AIJobsCompositions } from "./AIJobs";
import { Fable5Compositions } from "./Fable5";
import { AIBubbleCompositions } from "./AIBubble";
import { AIKillSwitchCompositions } from "./AIKillSwitch";
import { AmreetAintCompositions } from "./AmreetAint";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Bond007Compositions />
      <ChinaCompositions />
      <AIJobsCompositions />
      <Fable5Compositions />
      <AIBubbleCompositions />
      <AIKillSwitchCompositions />
      <AmreetAintCompositions />
    </>
  );
};
