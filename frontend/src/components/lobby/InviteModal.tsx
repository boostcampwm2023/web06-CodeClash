import Button from "../common/Button";
import Modal from "../common/Modal";
import { Iinvite } from "./Header";

interface InviteModalProps {
  closeModal: () => void;
  inviteList: Iinvite[];
}

const InviteModal: React.FC<InviteModalProps> = ({ closeModal, inviteList }) => {
  return (
    <Modal title="초대 리스트" closeModal={closeModal} className="h-[600px] px-2 flex flex-col overflow-scroll">
      {inviteList.map(({ roomName, host }) => (
        <div
          className="flex justify-between skew-x-right rounded-lg px-4 text-white text-sm hover:bg-lightskyblue hover:text-black"
          key={roomName + host}
        >
          <div className="grid w-[550px] p-2 skew-x-left">
            <div className="truncate">{roomName}</div>
            <div className="justify-self-end">{host}</div>
          </div>
          <div className="flex gap-2 p-2 skew-x-left">
            <Button color="black" title="수락" />
            <Button color="pink" title="거절" />
          </div>
        </div>
      ))}
    </Modal>
  );
};

export default InviteModal;
