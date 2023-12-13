import { useNavigate } from "react-router";
import { useRoomStore } from "../../store/useRoom";
import { GameRoom, useLobbyStore } from "../../store/useLobby";
import { useSocketStore } from "../../store/useSocket";
import { toast } from "../common/Toast/Toast";

interface LobbyRoomListItemProps extends GameRoom {
  onClick: () => void;
}

const LobbyRoomListItem: React.FC<LobbyRoomListItemProps> = ({
  roomId,
  roomName,
  capacity,
  userCount,
  state,
  onClick,
}) => {
  return (
    <button
      className="skew-x-right rounded-sm px-2 py-1 text-white hover:bg-lightskyblue hover:text-black"
      style={{ opacity: state === "playing" ? 0.5 : 1 }}
      key={roomId}
      onClick={onClick}
      disabled={state === "playing"}
    >
      <div className="skew-x-left flex flex-row items-center justify-between">
        <div className="text-[0.75rem]">{roomName.slice(0, 20)}</div>
        <div className="text-[0.75rem]">
          {userCount} / {capacity}
        </div>
      </div>
    </button>
  );
};

const LobbyRoomListBox: React.FC = () => {
  const navigate = useNavigate();
  const { setRoomId } = useRoomStore();
  const { gameRoomList } = useLobbyStore();
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

  const handleEnterRoom = (roomId: string) => {
    setRoomId(roomId);
    socket?.emit("enter_room", { roomId }, handleEnterRoomEvent);
  };

  const compareState = (a: GameRoom, b: GameRoom) => {
    if (a.state === b.state) return 0;
    if (a.state === "waiting") return -1;
    if (b.state === "waiting") return 1;
    return 0;
  };

  return (
    <div className="h-full flex flex-col flex-grow gap-4 border-[3px] border-white rounded-lg bg-skyblue p-4 ">
      <div className="skew-x-right bg-black rounded-sm text-white px-2 py-1">
        <div className="skew-x-left">방 리스트</div>
      </div>
      <div className="flex flex-col overflow-scroll p-1">
        {gameRoomList
          ?.sort(compareState)
          .map(({ roomId, roomName, capacity, userCount, state }) => (
            <LobbyRoomListItem
              key={roomId}
              roomId={roomId}
              capacity={capacity}
              roomName={roomName}
              userCount={userCount}
              state={state}
              onClick={() => handleEnterRoom(roomId)}
            />
          ))}
      </div>
    </div>
  );
};

export default LobbyRoomListBox;
