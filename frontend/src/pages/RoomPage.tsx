import { useEffect } from "react";
import RoomUserCard from "../components/room/UserCard";
import RoomChatBox from "../components/room/ChatBox";
import RoomButtonBox from "../components/room/ButtonBox";
import { useSocketStore } from "../store/useSocket";
import { useNavigate } from "react-router-dom";
import BarEffect from "../components/common/BarEffect";
import SlidePage from "../components/common/SlidePage";
import { useRoomStore } from "../store/useRoom";
import { ProblemType } from "../components/gameplay/problemType";
import { ICreateRoomResponse } from "../components/lobby/CreateRoomModal";

const RoomPage: React.FC = () => {
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const {
    roomId,
    userList,
    capacity,
    isStart,
    setIsStart,
    setAddRoomUser,
    setRemoveRoomUser,
    setChangeUserReady,
    setProblemList,
    setRoomInfo,
  } = useRoomStore();

  const handleUserEnterRoom = ({ userName }: { userName: string }) => {
    setAddRoomUser({ userName, ready: false });
  };

  const handleUserExitRoom = ({ userName }: { userName: string }) => {
    setRemoveRoomUser(userName);
  };

  const handleUserReady = ({ userName, ready }: { userName: string; ready: boolean }) => {
    setChangeUserReady(userName, ready);
  };

  const handleStart = ({ problems }: { problems: ProblemType[] }) => {
    setProblemList(problems);
    setIsStart(true);
    setTimeout(() => {
      setIsStart(false);
      setTimeout(() => {
        navigate("/game");
      }, 300);
    }, 3000);
  };

  const handleEnterRoom = ({ status, message }: { status: string; message: string }) => {
    if (status === "fail") {
      alert(message);
      navigate("/lobby");
    }
    if (status === "success") {
      socket?.emit("room_info", { roomId }, ({ status, roomId, userList, roomName, capacity }: ICreateRoomResponse) => {
        setRoomInfo({ roomId, roomName, capacity, isStart: false, userList, problemList: [] });
      });
    }
  };

  const handleKick = ({ userName }: { userName: string }) => {
    alert(userName + "으로부터 강퇴당했습니다");
    navigate("/lobby");
  };

  useEffect(() => {
    if (socket) {
      socket.emit("enter_room", { roomId }, handleEnterRoom);
      socket.on("user_enter_room", handleUserEnterRoom);
      socket.on("user_exit_room", handleUserExitRoom);
      socket.on("ready", handleUserReady);
      socket.on("start", handleStart);
      socket.on("kick", handleKick);
    }
    return () => {
      if (socket) {
        socket.emit("exit_room", { roomId });
        socket.off("user_enter_room", handleUserEnterRoom);
        socket.off("user_exit_room", handleUserExitRoom);
        socket.off("ready", handleUserReady);
        socket.off("start", handleStart);
        socket.off("kick", handleKick);
      }
    };
  }, [socket, roomId]);

  const emptyList = new Array(capacity - userList.length < 0 ? 0 : capacity - userList.length).fill({
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
      <BarEffect isStart={isStart} content="전투 시작!" />
      <div className="w-[65%] h-full grid grid-cols-3 gap-2 grid-rows-2">{users}</div>
      <div className="w-[35%] h-full flex flex-col items-center gap-3 ">
        <RoomChatBox />
        <RoomButtonBox />
      </div>
    </SlidePage>
  );
};

export default RoomPage;
