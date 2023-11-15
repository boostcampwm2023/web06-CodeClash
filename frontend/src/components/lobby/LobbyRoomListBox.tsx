interface LobbyRoomListItemProps {
  id: number;
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

const testRoomList = new Array(20)
  .fill(0)
  .map((_, i) => <LobbyRoomListItem key={i} id={i} capacity={4} name="1:1 파이썬 초보만@@@@@@@@@@@@" usercount={2} />);

const LobbyRoomListBox: React.FC = () => {
  return (
    <div className="h-full flex flex-col flex-grow gap-4 border-[3px] border-white rounded-lg bg-skyblue p-4 ">
      <div className="skew-x-right bg-black rounded-sm text-white px-2 py-1">
        <div className="skew-x-left">방 리스트</div>
      </div>
      <div className=" overflow-scroll p-1">{testRoomList}</div>
    </div>
  );
};

export default LobbyRoomListBox;
