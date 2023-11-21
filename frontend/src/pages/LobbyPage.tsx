import { useEffect, useState } from "react";
import LobbyHeader from "../components/lobby/LobbyHeader";
import LobbyMyInfo from "../components/lobby/LobbyMyInfo";
import LobbyRoomListBox from "../components/lobby/LobbyRoomListBox";
import LobbyUserListBox from "../components/lobby/LobbyUserListBox";
import { useSocketStore } from "../store/useSocket";

export interface IGameRoom {
  roomId: string;
  roomName: string;
  capacity: number;
  userCount: number;
}

const LobbyPage: React.FC = () => {
  const [userList, setUserList] = useState<string[]>([]);
  const [gameRoomList, setGameRoomList] = useState<IGameRoom[]>([]);
  const { socket } = useSocketStore();

  const handleLobbyConnect = ({ gameRoomList, userList }: { gameRoomList: IGameRoom[]; userList: string[] }) => {
    setUserList(userList);
    setGameRoomList(gameRoomList);
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection", handleLobbyConnect);
    }
    return () => {
      if (socket) {
        socket.off("connection", handleLobbyConnect);
        socket.disconnect();
      }
    };
  }, [socket]);

  return (
    <div className="p-16 w-full h-full flex flex-row">
      <LobbyHeader />
      <div className="h-full flex flex-col gap-2 mr-2">
        <LobbyUserListBox userList={userList} />
        <LobbyMyInfo />
      </div>
      <LobbyRoomListBox gameRoomList={gameRoomList} />
    </div>
  );
};

export default LobbyPage;
