import LobbyHeader from "../components/lobby/LobbyHeader";
import LobbyMyInfo from "../components/lobby/LobbyMyInfo";
import LobbyRoomListBox from "../components/lobby/LobbyRoomListBox";
import LobbyUserListBox from "../components/lobby/LobbyUserListBox";

const LobbyPage: React.FC = () => {
  return (
    <div className="p-16 w-full h-full flex flex-row">
      <LobbyHeader />
      <div className="h-full flex flex-col gap-2 mr-2">
        <LobbyUserListBox />
        <LobbyMyInfo />
      </div>

      <LobbyRoomListBox />
    </div>
  );
};

export default LobbyPage;
