import { useEffect, useState } from "react";
import { UserInfo } from "../../store/useRoom";
import { useSocketStore } from "../../store/useSocket";
import Modal from "../common/Modal";

interface InviteModalProps {
  closeModal: () => void;
}

const InviteModal: React.FC<InviteModalProps> = ({ closeModal }) => {
  const { socket } = useSocketStore();
  const [lobbyUserList, setLobbyUserList] = useState<UserInfo[]>();

  useEffect(() => {
    socket?.emit("lobby_info", ({ userList }: { userList: UserInfo[] }) => {
      setLobbyUserList(userList);
    });
  }, []);

  const handleInviteUser = (targetUserName: string) => {
    socket?.emit("invite", { userName: targetUserName });
    setLobbyUserList(prev => prev?.filter(({ userName }) => targetUserName !== userName));
  };

  return (
    <Modal title="초대하기" closeModal={closeModal} className="w-72 h-72">
      <div className="bg-lightskyblue rounded-md flex flex-col items-center gap-1 p-2 w-full h-full overflow-scroll">
        {lobbyUserList?.length ? (
          lobbyUserList.map(({ userName }) => (
            <button className="hover:text-black" key={userName} onClick={() => handleInviteUser(userName)}>
              {userName}
            </button>
          ))
        ) : (
          <div>로비에 유저가 없습니다</div>
        )}
      </div>
    </Modal>
  );
};

export default InviteModal;
