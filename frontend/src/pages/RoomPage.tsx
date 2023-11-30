import { useEffect, useState } from "react";
import RoomUserCard from "../components/room/UserCard";
import RoomChatBox from "../components/room/ChatBox";
import RoomButtonBox from "../components/room/ButtonBox";
import { useSocketStore } from "../store/useSocket";
import { useNavigate } from "react-router-dom";
import StartAnimation from "../components/room/StartAnimation";
import SlidePage from "../components/common/SlidePage";
import { UserInfo, useRoomStore } from "../store/useRoom";
import { GameRoom, useLobbyStore } from "../store/useLobby";

interface IExitRoomResponse {
  status: "success" | "fail";
  userList: UserInfo[];
  gameRoomList: GameRoom[];
}

const RoomPage: React.FC = () => {
  const [isStart, setIsStart] = useState(false);
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const { userList, capacity, setAddRoomUser, setRemoveRoomUser, setChangeUserReady } = useRoomStore();
  const { setLobby } = useLobbyStore();

  const handleUserEnterRoom = ({ userName }: { userName: string }) => {
    setAddRoomUser({ userName, ready: false });
  };

  const handleUserExitRoom = ({ userName }: { userName: string }) => {
    setRemoveRoomUser(userName);
  };

  const handleEnterLobby = ({ status, userList, gameRoomList }: IExitRoomResponse) => {
    if (status === "success") {
      setLobby({ userList, gameRoomList });
      navigate("/lobby");
    }
  };

  const handleUserReady = ({ userName, ready }: { userName: string; ready: boolean }) => {
    setChangeUserReady(userName, ready);
  };

  const handleStart = () => {
    setIsStart(true);
    setTimeout(() => {
      setIsStart(false);
      setTimeout(() => {
        navigate("/game");
      }, 300);
    }, 3000);
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

  const emptyList = new Array(capacity - userList.length).fill({
    isHost: false,
    userName: "대기중...",
    ready: false,
  });

  const users = userList
    .concat(emptyList)
    .map(({ userName, ready }, index) => (
      <RoomUserCard userName={userName} isHost={index === 0} ready={ready} key={userName + index} />
    ));

  return (
    <SlidePage className=" flex justify-center items-center w-full h-full gap-3 p-8 ">
      <StartAnimation isStart={isStart} />
      <div className="w-[65%] h-full grid grid-cols-3 gap-2 grid-rows-2">{users}</div>
      <div className="w-[35%] h-full flex flex-col items-center gap-3 ">
        <RoomChatBox />
        <RoomButtonBox />
      </div>
    </SlidePage>
  );
};

export default RoomPage;
