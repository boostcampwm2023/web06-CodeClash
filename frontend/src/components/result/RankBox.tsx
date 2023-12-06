import { useState } from "react";
import ResultRankItem from "./RankItem";

interface IUserList {
  username: string;
  message: string;
  score: number;
}

const tempUserList = [
  {
    username: "유저A",
    message: "알고리즘 그 잡채...",
    score: 33500,
  },
  {
    username: "유저B",
    message: "야생의 흔한 알고리즘 고수",
    score: 3498,
  },
  {
    username: "유저C",
    message: "야생의 흔한 알고리즘 고수",
    score: 3477,
  },
  {
    username: "유저D",
    message: "좀 더 노력이 필요해요!",
    score: 432,
  },
  {
    username: "유저E",
    message: "좀 더 노력이 필요해요!",
    score: 321,
  },
  {
    username: "유저F",
    message: "1 + 1이 뭔지도 모르시는 분",
    score: 1,
  },
];

const ResultRankBox: React.FC = () => {
  const [userList, setUserList] = useState<IUserList[]>(tempUserList);
  // const [userList, setUserList] = useState<IUserList[]>([]);

  const rankContents = userList.map(({ username, message, score }) => (
    <ResultRankItem username={username} message={message} score={score} key={username} />
  ));

  return <div className="flex flex-col h-full overflow-scroll py-2 my-2">{rankContents}</div>;
};

export default ResultRankBox;
