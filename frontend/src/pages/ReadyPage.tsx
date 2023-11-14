import { useState } from "react";
import UserCard from "../components/ready/UserCard";
import EmptyCard from "../components/ready/EmptyCard";
import ChatBox from "../components/ready/ChatBox";
import ButtonBox from "../components/ready/ButtonBox";

interface IUserInfo {
  isHost: boolean;
  username?: string;
  readyState: boolean;
}

const tempUserList = [
  {
    isUser: true,
    isHost: true,
    username: "지현배",
    readyState: false,
  },
  {
    isUser: true,
    isHost: false,
    username: "이근성",
    readyState: true,
  },
  {
    isUser: true,
    isHost: false,
    username: "이동하",
    readyState: true,
  },
  {
    isUser: true,
    isHost: false,
    username: "현찬우",
    readyState: false,
  },
  {
    isUser: false,
    isHost: false,
    username: "",
    readyState: false,
  },
  {
    isUser: false,
    isHost: false,
    username: "",
    readyState: false,
  },
];

const ReadyPage: React.FC = () => {
  const [userList, setUserList] = useState<IUserInfo[]>(tempUserList);
  // const [userList, setUserList] = useState<IUserInfo[]>(Array(6).fill({ isUser: false }));

  const users = userList.map(({ isHost, username, readyState }, index) => {
    if (!username) {
      return <EmptyCard key={index} />;
    }
    return <UserCard username={username} isHost={isHost} readyState={readyState} key={username + index} />;
  });

  return (
    <div className="flex justify-center items-center w-full h-full gap-3">
      <div className="w-[800px] grid grid-cols-3 gap-2">{users}</div>
      <div className="w-[600px] flex flex-col items-center gap-3">
        <ChatBox />
        <ButtonBox />
      </div>
    </div>
  );
};

export default ReadyPage;
