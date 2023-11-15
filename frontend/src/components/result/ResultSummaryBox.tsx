import ButtonBox from "./ButtonBox";
import RankBox from "./RankBox";

const ResultSummaryBox: React.FC = () => {
  return (
    <>
      <div>결과 요약</div>
      <RankBox />
      <ButtonBox />
    </>
  );
};

export default ResultSummaryBox;
