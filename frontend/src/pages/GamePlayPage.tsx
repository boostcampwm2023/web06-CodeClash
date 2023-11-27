import Button from "../components/common/Button";
import GameFooterBox from "../components/gameplay/FooterBox";
import GameHeaderBox from "../components/gameplay/HeaderBox";
import GamePlayBox from "../components/gameplay/PlayBox";
import GameProblemIdx from "../components/gameplay/ProblemIdx";

const GamePlayPage: React.FC = () => {
  return (
    <div className="pt-2 px-4 pb-14 w-full h-full flex flex-col items-center">
      <GameHeaderBox title="두 수의 합" />
      <GameProblemIdx currentIdx={1} totalIdx={3} />
      <div className="h-4"></div>
      <GamePlayBox />
    </div>
  );
};

export default GamePlayPage;
