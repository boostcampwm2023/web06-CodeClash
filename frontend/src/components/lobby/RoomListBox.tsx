import { useEffect } from "react";
import { IGameRoom, ILobbyUserInfo } from "../../pages/LobbyPage";
import { useSocketStore } from "../../store/useSocket";
import { useNavigate } from "react-router";

interface LobbyRoomListBoxProps {
  gameRoomList: IGameRoom[];
}

interface LobbyRoomListItemProps extends IGameRoom {
  onClick?: () => void;
}

interface IEnterRoomResponse extends IGameRoom {
  status: "success" | "fail";
  message: string;
  userList?: ILobbyUserInfo[];
}

const LobbyRoomListItem: React.FC<LobbyRoomListItemProps> = ({ roomId, roomName, capacity, userCount, onClick }) => {
  return (
    <div
      className="skew-x-right rounded-sm px-2 py-1 cursor-pointer text-white hover:bg-lightskyblue hover:text-black"
      key={roomId}
      onClick={onClick}
    >
      <div className="skew-x-left flex flex-row items-center justify-between">
        <div className="text-[0.75rem]">{roomName}</div>
        <div className="text-[0.75rem]">
          {userCount}/{capacity}
        </div>
      </div>
    </div>
  );
};

const LobbyRoomListBox: React.FC<LobbyRoomListBoxProps> = ({ gameRoomList }) => {
  const { socket } = useSocketStore();
  const navigate = useNavigate();

  const handleEnterRoom = (roomId: string) => {
    socket?.emit("enter_room", { roomId });
  };

  const handleRoomEntered = ({ status, roomId, roomName, capacity, userList }: IEnterRoomResponse) => {
    if (status === "fail") return;
    navigate("/room", { state: { data: { roomId, roomName, userList, capacity } } });
  };

  useEffect(() => {
    socket?.on("enter_room", handleRoomEntered);

    return () => {
      socket?.off("enter_room", handleRoomEntered);
    };
  }, [socket]);

  return (
    <div className="h-full flex flex-col flex-grow gap-4 border-[3px] border-white rounded-lg bg-skyblue p-4 ">
      <div className="skew-x-right bg-black rounded-sm text-white px-2 py-1">
        <div className="skew-x-left">방 리스트</div>
      </div>
      <div className=" overflow-scroll p-1">
        {gameRoomList
          .filter(({ state }) => state === "waiting")
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