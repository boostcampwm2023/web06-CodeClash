import { useEffect, useState } from "react";
import LobbyHeader from "../components/lobby/Header";
import LobbyMyInfo from "../components/lobby/MyInfo";
import LobbyRoomListBox from "../components/lobby/RoomListBox";
import LobbyUserListBox from "../components/lobby/UserListBox";
import { useSocketStore } from "../store/useSocket";

export interface IGameRoom {
  roomId: string;
  roomName: string;
  capacity: number;
  userCount: number;
  state: "playing" | "waiting";
}

const LobbyPage: React.FC = () => {
  const [userList, setUserList] = useState<string[]>([]);
  const [gameRoomList, setGameRoomList] = useState<IGameRoom[]>([]);
  const { socket } = useSocketStore();

  const handleLobbyConnect = ({ gameRoomList, userList }: { gameRoomList: IGameRoom[]; userList: string[] }) => {
    setUserList(userList);
    setGameRoomList(gameRoomList);
  };

  const handleUserEnterLobby = ({ userName }: { userName: string }) => {
    setUserList(prev => prev.concat(userName));
  };

  const handleUserExitLobby = ({ userName }: { userName: string }) => {
    setUserList(prev => prev.filter(name => name !== userName));
  };

  const handleCreateRoom = (roomInfo: IGameRoom) => {
    setGameRoomList(prev => prev.concat(roomInfo));
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection", handleLobbyConnect);
      socket.on("user_enter_lobby", handleUserEnterLobby);
      socket.on("user_exit_lobby", handleUserExitLobby);
      socket.on("user_create_room", handleCreateRoom);
    }
    return () => {
      if (socket) {
        socket.off("connection", handleLobbyConnect);
        socket.off("user_enter_lobby", handleUserEnterLobby);
        socket.off("user_exit_lobby", handleUserExitLobby);
        socket.off("user_create_room", handleCreateRoom);
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
