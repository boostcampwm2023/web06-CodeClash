import { useEffect } from "react";
import LobbyHeader from "../components/lobby/Header";
import LobbyMyInfo from "../components/lobby/MyInfo";
import LobbyRoomListBox from "../components/lobby/RoomListBox";
import LobbyUserListBox from "../components/lobby/UserListBox";
import { useSocketStore } from "../store/useSocket";
import { useNavigate } from "react-router-dom";
import SlidePage from "../components/common/SlidePage";
import { UserInfo, useRoomStore } from "../store/useRoom";
import { GameRoom, LobbyState, useLobbyStore } from "../store/useLobby";

interface IUserCreateRoomResponse extends GameRoom {
  userName: string;
}

interface ICreateRoomResponse extends GameRoom {
  status: "success" | "fail";
  userList: UserInfo[];
}

const LobbyPage: React.FC = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { setRoomInfo } = useRoomStore();
  const { setAddLobbyUser, setRemoveLobbyUser, setAddGameRoom, setRemoveGameRoom, setLobby } = useLobbyStore();

  const handleLobbyConnect = ({ gameRoomList, userList }: LobbyState) => {
    setLobby({ userList, gameRoomList });
  };

  const handleUserEnterLobby = ({ userName }: { userName: string }) => {
    setAddLobbyUser(userName);
  };

  const handleUserExitLobby = ({ userName }: { userName: string }) => {
    setRemoveLobbyUser(userName);
  };

  const handleUserCreateRoom = (roomInfo: IUserCreateRoomResponse) => {
    setRemoveLobbyUser(roomInfo?.userName);
    setAddGameRoom(roomInfo);
  };

  const handleRoomCreated = ({ status, roomId, userList, roomName, capacity }: ICreateRoomResponse) => {
    if (status === "success") {
      setRoomInfo({ roomId, roomName, capacity, userList, problemList: [] });
      navigate("/room");
    }
  };

  const handleDeleteRoom = ({ roomId }: { roomId: string }) => {
    setRemoveGameRoom(roomId);
  };

  useEffect(() => {
    if (socket) {
      socket.on("connection", handleLobbyConnect);
      socket.on("user_enter_lobby", handleUserEnterLobby);
      socket.on("user_exit_lobby", handleUserExitLobby);
      socket.on("user_create_room", handleUserCreateRoom);
      socket.on("create_room", handleRoomCreated);
      socket.on("delete_room", handleDeleteRoom);
      socket.on("room_start", handleDeleteRoom);
    }
    return () => {
      if (socket) {
        socket.off("connection", handleLobbyConnect);
        socket.off("user_enter_lobby", handleUserEnterLobby);
        socket.off("user_exit_lobby", handleUserExitLobby);
        socket.off("user_create_room", handleUserCreateRoom);
        socket.off("create_room", handleRoomCreated);
        socket.off("delete_room", handleDeleteRoom);
        socket.off("room_start", handleDeleteRoom);
      }
    };
  }, [socket]);

  return (
    <SlidePage className="p-4 pt-12 w-full h-full flex flex-row">
      <LobbyHeader />
      <div className="h-full flex flex-col gap-2 mr-2">
        <LobbyUserListBox />
        <LobbyMyInfo />
      </div>
      <LobbyRoomListBox />
    </SlidePage>
  );
};

export default LobbyPage;
