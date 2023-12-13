import { useNavigate } from "react-router-dom";
import { useLobbyStore } from "../../store/useLobby";
import { useRoomStore } from "../../store/useRoom";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useSocketStore } from "../../store/useSocket";
import { toast } from "../common/Toast/Toast";

interface InviteModalProps {
  closeModal: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ closeModal }) => {
  const navigate = useNavigate();
  const { inviteList, setRemoveInvite } = useLobbyStore();
  const { setRoomId } = useRoomStore();
  const { socket } = useSocketStore();

  const handleEnterRoomEvent = ({ status, message }: { status: string; message: string }) => {
    if (status === "error") {
      alert(message);
      navigate("/lobby");
    }
    if (status === "success") {
      navigate("/room");
    }
  };

  const handleAccept = (roomId: string) => {
    setRoomId(roomId);
    setRemoveInvite(roomId);
    closeModal();
    socket?.emit("enter_room", { roomId }, handleEnterRoomEvent);
    navigate("/room");
  };

  const handleReject = (roomId: string) => {
    setRemoveInvite(roomId);
  };

  return (
    <Modal
      title="초대 리스트"
      closeModal={closeModal}
      className="h-72 w-[40rem] px-2 flex flex-col items-center overflow-scroll"
    >
      {inviteList.length > 0 ? (
        inviteList.map(({ roomId, roomName, userName }) => (
          <div
            className="w-full flex justify-between skew-x-right rounded-lg px-4 text-white text-sm hover:bg-lightskyblue hover:text-black"
            key={roomId}
          >
            <div className="grow grid p-2 skew-x-left">
              <div className="truncate">{roomName}</div>
              <div className="justify-self-end">{userName}</div>
            </div>
            <div className="flex gap-2 p-2 skew-x-left">
              <Button onClick={() => handleAccept(roomId)} color="black" title="수락" />
              <Button onClick={() => handleReject(roomId)} color="pink" title="거절" />
            </div>
          </div>
        ))
      ) : (
        <div>받은 초대가 없습니다</div>
      )}
    </Modal>
  );
};

export default InviteModal;
