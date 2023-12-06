import ResultButtonBox from "./ButtonBox";
import ResultRankBox from "./RankBox";

interface ResultSummaryBoxProps {
  selectedUser: string;
  setSelecteduser: React.Dispatch<React.SetStateAction<string>>;
}

const ResultSummaryBox: React.FC<ResultSummaryBoxProps> = ({ selectedUser, setSelecteduser }) => {
  return (
    <>
      <div>결과 요약</div>
      <ResultRankBox selectedUser={selectedUser} setSelectUser={setSelecteduser} />
      <ResultButtonBox />
    </>
  );
};

export default ResultSummaryBox;
