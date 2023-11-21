import ResultButtonBox from "./ButtonBox";
import ResultRankBox from "./RankBox";

const ResultSummaryBox: React.FC = () => {
  return (
    <>
      <div>결과 요약</div>
      <ResultRankBox />
      <ResultButtonBox />
    </>
  );
};

export default ResultSummaryBox;
