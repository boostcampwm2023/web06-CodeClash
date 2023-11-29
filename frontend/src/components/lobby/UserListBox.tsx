import { UserInfo } from "../../store/useRoom";

interface LobbyUserListBoxProps {
  userList: UserInfo[];
}

const LobbyUserListBox: React.FC<LobbyUserListBoxProps> = ({ userList }) => {
  const userListItems = userList.map(({ userName }, idx) => (
    <div className="text-[0.75rem] cursor-pointer" key={userName + String(idx)}>
      {userName}
    </div>
  ));

  return (
    <div className="h-full flex flex-col gap-4 border-[3px] border-white rounded-lg bg-skyblue p-4 overflow-hidden">
      <div className="skew-x-right bg-black rounded-sm text-white px-2 py-1">
        <div className="skew-x-left">유저 리스트</div>
      </div>
      <div className=" bg-lightskyblue rounded-md flex flex-col gap-1 p-2 w-full h-full overflow-scroll">
        {userListItems}
      </div>
    </div>
  );
};

export default LobbyUserListBox;
