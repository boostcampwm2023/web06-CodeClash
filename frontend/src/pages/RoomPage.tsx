import { useEffect, useState } from "react";
import RoomUserCard from "../components/room/UserCard";
import RoomChatBox from "../components/room/ChatBox";
import RoomButtonBox from "../components/room/ButtonBox";
import { useSocketStore } from "../store/useSocket";
import { useLocation, useNavigate } from "react-router-dom";
import { IGameRoom, ILobbyUserInfo } from "./LobbyPage";

export interface IUserInfo {
  isHost: boolean;
  userName: string;
  ready: boolean;
}

interface IRoomInfo {
  roomId: string;
  roomName: string;
  capacity: number;
}

interface IExitRoomResponse {
  status: "success" | "fail";
  userList: string[];
  gameRoomList: IGameRoom[];
}

const RoomPage: React.FC = () => {
  const [userList, setUserList] = useState<IUserInfo[]>([]);
  const [roomInfo, setRoomInfo] = useState<IRoomInfo>();
  const navigate = useNavigate();
  const location = useLocation();
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!location.state) {
      navigate("/login");
      return;
    }
    const { userList, roomId, roomName, capacity } = location.state.data;
    setUserList(
      userList.map(({ userName, ready }: ILobbyUserInfo, index: number) => ({
        isHost: index === 0,
        userName,
        ready,
      })),
    );
    setRoomInfo({ roomId, roomName, capacity });
  }, [location]);

  const handleUserEnterRoom = ({ userName }: { userName: string }) => {
    setUserList(prev => prev.concat({ userName, isHost: false, ready: false }));
  };

  const handleUserExitRoom = ({ userName: newUserName }: { userName: string }) => {
    setUserList(prev =>
      prev
        .filter(({ userName }) => userName !== newUserName)
        .map((userInfo: IUserInfo, index: number) => ({ ...userInfo, isHost: index === 0 })),
    );
  };

  const handleEnterLobby = ({ status, userList, gameRoomList }: IExitRoomResponse) => {
    if (status === "success") {
      navigate("/lobby", { state: { data: { userList, gameRoomList } } });
    }
  };

  const handleUserReady = ({ userName, ready }: { userName: string; ready: boolean }) => {
    setUserList(prev => prev.map(user => (user.userName === userName ? { ...user, ready } : user)));
  };

  const handleStart = () => {
    navigate("/game", { state: { data: { ...roomInfo, userList } } });
  };

  useEffect(() => {
    if (socket) {
      socket.on("user_enter_room", handleUserEnterRoom);
      socket.on("user_exit_room", handleUserExitRoom);
      socket.on("exit_room", handleEnterLobby);
      socket.on("ready", handleUserReady);
      socket.on("start", handleStart);
    }
    return () => {
      if (socket) {
        socket.off("user_enter_room", handleUserEnterRoom);
        socket.off("user_exit_room", handleUserExitRoom);
        socket.off("exit_room", handleEnterLobby);
        socket.off("ready", handleUserReady);
        socket.off("start", handleStart);
      }
    };
  }, [socket]);

  const emptyList = new Array((roomInfo?.capacity ?? userList.length) - userList.length).fill({
    isHost: false,
    userName: "대기중...",
    ready: false,
  });

  const users = userList
    .concat(emptyList)
    .map(({ isHost, userName, ready }, index) => (
      <RoomUserCard userName={userName} isHost={isHost} ready={ready} key={userName + index} />
    ));

  return (
    <div className="flex justify-center items-center w-full h-full gap-3 p-16">
      <div className="w-[65%] h-full grid grid-cols-3 gap-2 ">{users}</div>
      <div className="w-[35%] h-full flex flex-col items-center gap-3 ">
        <RoomChatBox roomId={roomInfo?.roomId || ""} />
        <RoomButtonBox roomId={roomInfo?.roomId || ""} />
      </div>
    </div>
  );
};

export default RoomPage;
