import { useState } from "react";
import GameHeaderBox from "../components/gameplay/HeaderBox";
import GamePlayBox from "../components/gameplay/PlayBox";
import GameProblemIdx from "../components/gameplay/ProblemIdx";
import SlidePage from "../components/common/SlidePage";
import { useRoomStore } from "../store/useRoom";

const GamePlayPage: React.FC = () => {
  const { problemList } = useRoomStore();
  const [currentProblemIdx, setCurrentProblemIdx] = useState<number>(0);
  const GAME_COUNT = problemList.length;

  return (
    <SlidePage className="pt-2 px-4 pb-14 w-full h-full flex flex-col items-center">
      <GameHeaderBox title={problemList[currentProblemIdx]?.title || ""} />
      <GameProblemIdx currentIdx={currentProblemIdx + 1} totalIdx={GAME_COUNT} />
      <div className="h-4"></div>
      <GamePlayBox problemInfo={problemList[currentProblemIdx]} />
    </SlidePage>
  );
};

export default GamePlayPage;
