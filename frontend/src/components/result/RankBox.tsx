import ResultRankItem from "./RankItem";
import { useRoomStore } from "../../store/useRoom";

interface ResultRankBoxProps {
  selectedUser: string;
  setSelectUser: React.Dispatch<React.SetStateAction<string>>;
  userScore: Record<string, number>;
}

const messageList = [
  "알고리즘 그 잡채...",
  "야생의 흔한 알고리즘 고수",
  "좀 더 노력이 필요해요!",
  "좀 더 노력이 필요해요!",
  "좀 더 노력이 필요해요!",
  "1 + 1이 뭔지도 모르시는 분",
];

const ResultRankBox: React.FC<ResultRankBoxProps> = ({ userScore, selectedUser, setSelectUser }) => {
  const { userList, capacity } = useRoomStore();
  const rankContents = userList
    .sort((a, b) => (userScore[a.userName] ?? 0) - (userScore[b.userName] ?? 0))
    .map(({ userName }, idx) => (
      <ResultRankItem
        username={userName}
        isSelected={userName === selectedUser}
        message={messageList[Math.floor((idx * capacity) / 6)]}
        score={idx + 1}
        key={userName}
        idx={idx}
        onClick={() => setSelectUser(userName)}
      />
    ));

  return <div className="flex flex-col h-full overflow-scroll py-2 my-2">{rankContents}</div>;
};

export default ResultRankBox;
