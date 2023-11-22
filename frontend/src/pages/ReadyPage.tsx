import { useEffect, useState } from "react";
import ReadyUserCard from "../components/ready/UserCard";
import ReadyChatBox from "../components/ready/ChatBox";
import ReadyButtonBox from "../components/ready/ButtonBox";
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

const ReadyPage: React.FC = () => {
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

  const handleExitRoom = () => {
    if (socket) {
      socket.emit("exit_room", { roomId: roomInfo?.roomId });
    }
  };

  const handleEnterLobby = ({ status, userList, gameRoomList }: IExitRoomResponse) => {
    if (status === "success") {
      navigate("/lobby", { state: { data: { userList, gameRoomList } } });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("exit_room", handleEnterLobby);
    }
    return () => {
      if (socket) {
        socket.off("exit_room", handleEnterLobby);
      }
      handleExitRoom();
    };
  }, [socket]);

  const users = userList.map(({ isHost, userName, ready }, index) => (
    <ReadyUserCard userName={userName} isHost={isHost} ready={ready} key={userName + index} />
  ));

  return (
    <div className="flex justify-center items-center w-full h-full gap-3">
      <div className="w-[800px] grid grid-cols-3 gap-2">{users}</div>
      <div className="w-[600px] flex flex-col items-center gap-3">
        <ReadyChatBox />
        <ReadyButtonBox exitRoom={handleExitRoom} />
      </div>
    </div>
  );
};

export default ReadyPage;
