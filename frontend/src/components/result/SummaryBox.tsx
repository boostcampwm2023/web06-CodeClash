import ResultButtonBox from "./ButtonBox";
import ResultRankBox from "./RankBox";

interface ResultSummaryBoxProps {
  selectedUser: string;
  setSelecteduser: React.Dispatch<React.SetStateAction<string>>;
  userScore: Record<string, number>;
}

const ResultSummaryBox: React.FC<ResultSummaryBoxProps> = ({ userScore, selectedUser, setSelecteduser }) => {
  return (
    <>
      <div>결과 요약</div>
      <ResultRankBox userScore={userScore} selectedUser={selectedUser} setSelectUser={setSelecteduser} />
      <ResultButtonBox />
    </>
  );
};

export default ResultSummaryBox;
