import { useEffect, useState } from "react";
import GameHeaderBox from "../components/gameplay/HeaderBox";
import GamePlayBox from "../components/gameplay/PlayBox";
import GameProblemIdx from "../components/gameplay/ProblemIdx";
import { ProblemType } from "../components/gameplay/problemType";
import { getProblemById } from "../api/problem";
import { motion } from "framer-motion";
import SlidePage from "../components/common/SlidePage";

const tempProblemId = [10];
const GAME_COUNT = 3;
const GamePlayPage: React.FC = () => {
  const [problemList, setProblemList] = useState<ProblemType[]>([]);
  const [currentProblemIdx, setCurrentProblemIdx] = useState<number>(0);

  useEffect(() => {
    Promise.all(tempProblemId.map(id => getProblemById(id))).then(res => {
      setProblemList(res.map(r => r?.data));
    });
  }, []);

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
