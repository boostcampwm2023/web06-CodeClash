import { IGameRoom } from "../../pages/LobbyPage";

interface LobbyRoomListBoxProps {
  gameRoomList: IGameRoom[];
}

interface LobbyRoomListItemProps {
  id: string;
  name: string;
  capacity: number;
  usercount: number;
  onClick?: () => void;
}

const LobbyRoomListItem: React.FC<LobbyRoomListItemProps> = ({ id, name, capacity, usercount, onClick }) => {
  return (
    <div
      className="skew-x-right rounded-sm px-2 py-1 cursor-pointer text-white hover:bg-lightskyblue hover:text-black"
      onClick={onClick}
    >
      <div className="skew-x-left flex flex-row items-center justify-between">
        <div className="text-[0.75rem]">{name}</div>
        <div className="text-[0.75rem]">
          {usercount}/{capacity}
        </div>
      </div>
    </div>
  );
};

const LobbyRoomListBox: React.FC<LobbyRoomListBoxProps> = ({ gameRoomList }) => {
  return (
    <div className="h-full flex flex-col flex-grow gap-4 border-[3px] border-white rounded-lg bg-skyblue p-4 ">
      <div className="skew-x-right bg-black rounded-sm text-white px-2 py-1">
        <div className="skew-x-left">방 리스트</div>
      </div>
      <div className=" overflow-scroll p-1">
        {gameRoomList.map(({ roomId, roomName, capacity, userCount }) => (
          <LobbyRoomListItem key={roomId} id={roomId} capacity={capacity} name={roomName} usercount={userCount} />
        ))}
      </div>
    </div>
  );
};

export default LobbyRoomListBox;
