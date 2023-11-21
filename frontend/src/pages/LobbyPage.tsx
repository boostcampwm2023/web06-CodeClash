import { useEffect, useState } from "react";
import LobbyHeader from "../components/lobby/Header";
import LobbyMyInfo from "../components/lobby/MyInfo";
import LobbyRoomListBox from "../components/lobby/RoomListBox";
import LobbyUserListBox from "../components/lobby/UserListBox";
import { useSocketStore } from "../store/useSocket";
import { motion } from "framer-motion";
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

  const handleUserEnterLobby = ({ userName }: { userName: string }) => {
    setUserList(prev => prev.concat(userName));
  };

  const handleUserExitLobby = ({ userName }: { userName: string }) => {
    setUserList(prev => prev.filter(name => name !== userName));
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection", handleLobbyConnect);
      socket.on("user_enter_lobby", handleUserEnterLobby);
      socket.on("user_exit_lobby", handleUserExitLobby);
    }
    return () => {
      if (socket) {
        socket.off("connection", handleLobbyConnect);
        socket.off("user_enter_lobby", handleUserEnterLobby);
        socket.off("user_exit_lobby", handleUserExitLobby);
      }
    };
  }, [socket]);

  return (
    <motion.div
      className="p-16 w-full h-full flex flex-row"
      initial={{
        x: "-100%",
      }}
      animate={{
        x: 0,
      }}
      exit={{
        x: "100%",
      }}
      transition={{
        duration: 0.5,
      }}
    >
      <LobbyHeader />
      <div className="h-full flex flex-col gap-2 mr-2">
        <LobbyUserListBox userList={userList} />
        <LobbyMyInfo />
      </div>
      <LobbyRoomListBox gameRoomList={gameRoomList} />
    </motion.div>
  );
};

export default LobbyPage;
