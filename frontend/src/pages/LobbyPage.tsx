import { useEffect, useState } from "react";
import LobbyHeader from "../components/lobby/Header";
import LobbyMyInfo from "../components/lobby/MyInfo";
import LobbyRoomListBox from "../components/lobby/RoomListBox";
import LobbyUserListBox from "../components/lobby/UserListBox";
import { useSocketStore } from "../store/useSocket";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export interface IGameRoom {
  roomId: string;
  roomName: string;
  capacity: number;
  userCount: number;
  state: "playing" | "waiting";
}

export interface ILobbyUserInfo {
  userName: string;
  ready?: boolean;
}

interface IUserCreateRoomResponse extends IGameRoom {
  userName: string;
}

interface ICreateRoomResponse extends IGameRoom {
  status: "success" | "fail";
  userList: ILobbyUserInfo[];
}

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userList, setUserList] = useState<ILobbyUserInfo[]>([]);
  const [gameRoomList, setGameRoomList] = useState<IGameRoom[]>([]);
  const { socket } = useSocketStore();

  useEffect(() => {
    if (location.state) {
      setUserList(prev => location.state.data.userList || prev);
      setGameRoomList(prev => location.state.data.gameRoomList || prev);
    }
  }, [location.state]);

  const handleLobbyConnect = ({
    gameRoomList,
    userList,
  }: {
    gameRoomList: IGameRoom[];
    userList: ILobbyUserInfo[];
  }) => {
    setUserList(userList);
    setGameRoomList(gameRoomList);
  };

  const handleUserEnterLobby = ({ userName }: { userName: string }) => {
    setUserList(prev => prev.concat({ userName }));
  };

  const handleUserExitLobby = ({ userName: exitedUserName }: { userName: string }) => {
    setUserList(prev => prev.filter(({ userName }) => userName !== exitedUserName));
  };

  const handleCreateRoom = (roomInfo: IUserCreateRoomResponse) => {
    setUserList(prev => prev.filter(({ userName }) => userName !== roomInfo?.userName));
    setGameRoomList(prev => prev.concat(roomInfo));
  };

  const handleRoomCreated = ({ status, roomId, userList, roomName, capacity }: ICreateRoomResponse) => {
    if (status === "success") {
      navigate("/room", { state: { data: { roomId, roomName, userList, capacity } } });
    }
  };

  const handleDeleteRoom = ({ roomId: deleteRoomId }: { roomId: string }) => {
    setGameRoomList(prev => prev.filter(({ roomId }) => roomId !== deleteRoomId));
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection", handleLobbyConnect);
      socket.on("user_enter_lobby", handleUserEnterLobby);
      socket.on("user_exit_lobby", handleUserExitLobby);
      socket.on("user_create_room", handleCreateRoom);
      socket.on("create_room", handleRoomCreated);
      socket.on("delete_room", handleDeleteRoom);
    }
    return () => {
      if (socket) {
        socket.off("connection", handleLobbyConnect);
        socket.off("user_enter_lobby", handleUserEnterLobby);
        socket.off("user_exit_lobby", handleUserExitLobby);
        socket.off("user_create_room", handleCreateRoom);
        socket.off("create_room", handleRoomCreated);
        socket.off("delete_room", handleDeleteRoom);
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
        <LobbyUserListBox userList={userList ?? []} />
        <LobbyMyInfo />
      </div>
      <LobbyRoomListBox gameRoomList={gameRoomList ?? []} />
    </motion.div>
  );
};

export default LobbyPage;
