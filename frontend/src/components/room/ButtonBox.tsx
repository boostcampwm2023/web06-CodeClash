import { useRoomStore } from "../../store/useRoom";
import { useSocketStore } from "../../store/useSocket";
import Button from "../common/Button";

const RoomButtonBox: React.FC = () => {
  const { socket } = useSocketStore();
  const { roomId } = useRoomStore();

  const handleExitRoom = () => {
    socket?.emit("exit_room", { roomId });
  };

  const handleClickReady = () => {
    socket?.emit("ready", { roomId });
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <Button onClick={handleClickReady} color="pink" title="READY!" subTitle="난투 시작" />
      <Button color="yellow" title="INVITE" subTitle="초대하기" />
      <Button onClick={handleExitRoom} color="skyblue" title="EXIT" subTitle="나가기" />
    </div>
  );
};

export default RoomButtonBox;
