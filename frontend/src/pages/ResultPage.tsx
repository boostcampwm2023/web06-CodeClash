import GameHeaderBox from "../components/gameplay/HeaderBox";
import CodeViewerBox from "../components/result/CodeViewerBox";
import ResultSummaryBox from "../components/result/SummaryBox";

const ResultPage: React.FC = () => {
  return (
    <div className="flex justify-center items-center w-full h-full gap-3">
      <GameHeaderBox title="결과" />
      <div className="w-[500px] flex flex-col justify-center gap-2 text-white">
        <ResultSummaryBox />
      </div>
      <div className="w-[800px] flex flex-col items-center gap-3">
        <CodeViewerBox />
      </div>
    </div>
  );
};

export default ResultPage;
