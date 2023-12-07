import { useNavigate } from "react-router";
import { useRoomStore } from "../../store/useRoom";
import { useSocketStore } from "../../store/useSocket";
import Button from "../common/Button";
import { useState } from "react";
import InviteModal from "./InviteModal";

const RoomButtonBox: React.FC = () => {
  const [isModalOpened, setModalOpened] = useState(false);
  const { socket } = useSocketStore();
  const { roomId, isStart } = useRoomStore();
  const navigate = useNavigate();

  const handleClickReady = () => {
    if (isStart) return;
    socket?.emit("ready", { roomId });
  };

  const handleClickInvite = () => {
    setModalOpened(true);
  };

  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <Button onClick={handleClickReady} color="pink" title="READY!" subTitle="난투 시작" />
      <Button onClick={handleClickInvite} color="yellow" title="INVITE" subTitle="초대하기" />
      <Button onClick={() => navigate("/lobby")} color="skyblue" title="EXIT" subTitle="나가기" />
      {isModalOpened ? <InviteModal closeModal={() => setModalOpened(false)} /> : null}
    </div>
  );
};

export default RoomButtonBox;
