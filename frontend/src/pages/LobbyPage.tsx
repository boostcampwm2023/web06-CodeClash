import { useEffect } from "react";
import LobbyHeader from "../components/lobby/Header";
import LobbyMyInfo from "../components/lobby/MyInfo";
import LobbyRoomListBox from "../components/lobby/RoomListBox";
import LobbyUserListBox from "../components/lobby/UserListBox";
import { useSocketStore } from "../store/useSocket";
import SlidePage from "../components/common/SlidePage";
import { GameRoom, useLobbyStore } from "../store/useLobby";
import { UserInfo, useRoomStore } from "../store/useRoom";

interface IUserCreateRoomResponse extends GameRoom {
  userName: string;
}

const LobbyPage: React.FC = () => {
  const { socket } = useSocketStore();
  const { setAddLobbyUser, setRemoveLobbyUser, setAddGameRoom, setRemoveGameRoom, setLobby, setRoomUserCount } =
    useLobbyStore();
  const { setRoomId } = useRoomStore();

  const handleLobbyConnect = ({ status }: { status: string }) => {
    if (status === "success") {
      socket?.emit("lobby_info", (lobbyInfo: { userList: UserInfo[]; roomList: GameRoom[] }) => {
        setLobby({ userList: lobbyInfo.userList, gameRoomList: lobbyInfo.roomList });
      });
    }
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

  const handleDeleteRoom = ({ roomId }: { roomId: string }) => {
    setRemoveGameRoom(roomId);
  };

  const handleRoomUserChange = ({ roomId, userCount }: { roomId: string; userCount: number }) => {
    setRoomUserCount(roomId, userCount);
  };

  useEffect(() => {
    if (socket) {
      socket.emit("enter_lobby", handleLobbyConnect);
      socket.on("user_enter_lobby", handleUserEnterLobby);
      socket.on("user_exit_lobby", handleUserExitLobby);
      socket.on("user_create_room", handleUserCreateRoom);
      socket.on("delete_room", handleDeleteRoom);
      socket.on("room_start", handleDeleteRoom);
      socket.on("change_user_count", handleRoomUserChange);
    }
    return () => {
      if (socket) {
        socket.emit("exit_lobby");
        socket.off("user_enter_lobby", handleUserEnterLobby);
        socket.off("user_exit_lobby", handleUserExitLobby);
        socket.off("user_create_room", handleUserCreateRoom);
        socket.off("delete_room", handleDeleteRoom);
        socket.off("room_start", handleDeleteRoom);
        socket.off("change_user_count", handleRoomUserChange);
      }
    };
  }, [socket]);

  useEffect(() => {
    setRoomId("");
  }, []);

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
