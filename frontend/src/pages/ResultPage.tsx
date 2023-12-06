import SlidePage from "../components/common/SlidePage";
import GameHeaderBox from "../components/gameplay/HeaderBox";
import CodeViewerBox from "../components/result/CodeViewerBox";
import ResultSummaryBox from "../components/result/SummaryBox";

const ResultPage: React.FC = () => {
  return (
    <SlidePage className="flex justify-center items-center w-full h-full gap-3 p-12">
      <GameHeaderBox title="결과" />
      <div className="w-[35%] min-w-[15rem] h-full flex flex-col justify-center gap-2 text-white">
        <ResultSummaryBox />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3">
        <CodeViewerBox />
      </div>
    </SlidePage>
  );
};

export default ResultPage;
