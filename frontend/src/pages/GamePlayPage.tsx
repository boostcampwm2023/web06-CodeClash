import { useEffect, useState } from "react";
import GameHeaderBox from "../components/gameplay/HeaderBox";
import GamePlayBox from "../components/gameplay/PlayBox";
import SlidePage from "../components/common/SlidePage";
import { useRoomStore } from "../store/useRoom";
import { useNavigate } from "react-router-dom";
import { useSocketStore } from "../store/useSocket";

const GamePlayPage: React.FC = () => {
  const { problemList, setAllUserReady, isStart, setIsStart, setRemoveRoomUser } = useRoomStore();
  const { socket } = useSocketStore();
  const [currentProblemIdx, setCurrentProblemIdx] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (problemList.length === 0 || !isStart) {
      socket?.emit("exit_room");
      navigate("/lobby");
    }
    setAllUserReady(false);
  }, [isStart]);

  useEffect(() => {
    return () => {
      setIsStart(false);
    };
  }, []);
  const handleUserExitRoom = ({ userName }: { userName: string }) => {
    setRemoveRoomUser(userName);
  };
  useEffect(() => {
    socket?.on("user_exit_room", handleUserExitRoom);
    return () => {
      socket?.off("user_exit_room", handleUserExitRoom);
    };
  }, [socket]);

  return (
    <SlidePage className="pt-12 px-4 pb-14 w-full h-full flex flex-col items-center">
      <GameHeaderBox title={problemList[currentProblemIdx]?.title || ""} />
      <div className="h-4"></div>
      <GamePlayBox problemInfo={problemList[currentProblemIdx]} />
    </SlidePage>
  );
};

export default GamePlayPage;
