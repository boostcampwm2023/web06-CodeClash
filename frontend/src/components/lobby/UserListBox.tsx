import { useState } from "react";
import { useLobbyStore } from "../../store/useLobby";
import UserInfoModal from "./UserInfoModal";

const LobbyUserListBox: React.FC = () => {
  const { userList } = useLobbyStore();
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const userListItems = userList.map(({ userName }, idx) => (
    <button
      onClick={() => setTargetUser(userName)}
      className="text-[0.75rem] cursor-pointer text-start"
      key={userName + String(idx)}
    >
      {userName}
    </button>
  ));

  return (
    <div className="h-full flex flex-col gap-4 border-[3px] border-white rounded-lg bg-skyblue p-4 overflow-hidden">
      <div className="skew-x-right bg-black rounded-sm text-white px-2 py-1">
        <div className="skew-x-left">유저 리스트</div>
      </div>
      <div className=" bg-lightskyblue rounded-md flex flex-col gap-1 p-2 w-full h-full overflow-scroll">
        {userListItems}
      </div>
      {targetUser !== null ? <UserInfoModal closeModal={() => setTargetUser(null)} userName={targetUser} /> : null}
    </div>
  );
};

export default LobbyUserListBox;
