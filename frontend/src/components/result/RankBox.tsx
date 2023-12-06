import { useState } from "react";
import ResultRankItem from "./RankItem";
import { useRoomStore } from "../../store/useRoom";

interface IUserList {
  username: string;
  score: number;
}

interface ResultRankBoxProps {
  selectedUser: string;
  setSelectUser: React.Dispatch<React.SetStateAction<string>>;
}

const tempUserList = [
  {
    username: "유저A",
    score: 1,
  },
  {
    username: "유저B",
    score: 2,
  },
  {
    username: "유저C",
    score: 3,
  },
  {
    username: "유저D",
    score: 4,
  },
  {
    username: "유저E",
    score: 5,
  },
  {
    username: "유저F",
    score: 6,
  },
];

const messageList = [
  "알고리즘 그 잡채...",
  "야생의 흔한 알고리즘 고수",
  "좀 더 노력이 필요해요!",
  "좀 더 노력이 필요해요!",
  "좀 더 노력이 필요해요!",
  "1 + 1이 뭔지도 모르시는 분",
];

const ResultRankBox: React.FC<ResultRankBoxProps> = ({ selectedUser, setSelectUser }) => {
  const { userList, capacity } = useRoomStore();
  const rankContents = userList
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .map(({ userName, score }, idx) => (
      <ResultRankItem
        username={userName}
        isSelected={userName === selectedUser}
        message={messageList[Math.floor((idx * capacity) / 6)]}
        score={score ?? 0}
        key={userName}
        idx={idx}
        onClick={() => setSelectUser(userName)}
      />
    ));

  return <div className="flex flex-col h-full overflow-scroll py-2 my-2">{rankContents}</div>;
};

export default ResultRankBox;
