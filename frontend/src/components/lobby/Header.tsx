import Button from "../common/Button";
import { useState } from "react";
import InviteModal from "./InviteModal";
import CreateRoomModal from "./CreateRoomModal";
import { useLoginStore } from "../../store/useLogin";
import { useSocketStore } from "../../store/useSocket";

enum HeaderStatus {
  LOBBY = "lobby",
  MYINFO = "myinfo",
  NOTIFICATION = "notification",
  ROOM = "room",
  LOGOUT = "logout",
}

export interface Iinvite {
  roomName: string;
  host: string;
}

const LobbyHeader: React.FC = () => {
  const [selectedHeader, setSelectedHeader] = useState<HeaderStatus>(HeaderStatus.LOBBY);
  const [inviteList, setInviteList] = useState<Iinvite[]>([]);
  const { setLogout } = useLoginStore();
  const { socket, setSocketClear } = useSocketStore();

  const closeModal = () => {
    setSelectedHeader(HeaderStatus.LOBBY);
  };

  const handleLogout = () => {
    socket?.disconnect();
    setSocketClear();
    setLogout();
  };

  return (
    <div className="absolute top-0 -translate-x-[50%] left-[50%] ">
      <div className="absolute h-full w-full bg-black rounded-b-sm skew-x-left -right-2 z-0"></div>
      <div className="absolute h-full w-full bg-black rounded-b-sm skew-x-right -left-2 z-0 "></div>
      <div className="relative px-4 py-2 grid grid-cols-4 text-[24px] gap-1 z-10 ">
        <Button
          color={selectedHeader === HeaderStatus.LOBBY ? "pink" : "skyblue"}
          title="로비"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.LOBBY)}
        />
        <Button
          color={selectedHeader === HeaderStatus.MYINFO ? "pink" : "skyblue"}
          title="내정보"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.MYINFO)}
        />
        {/* <Button
          color={selectedHeader === HeaderStatus.NOTIFICATION ? "pink" : "skyblue"}
          title="알림"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.NOTIFICATION)}
        /> */}
        <Button
          color={selectedHeader === HeaderStatus.ROOM ? "pink" : "skyblue"}
          title="방 생성"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.ROOM)}
        />
        <Button
          color="skyblue"
          title="로그아웃"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={handleLogout}
        />
      </div>
      {selectedHeader === HeaderStatus.NOTIFICATION && <InviteModal closeModal={closeModal} inviteList={inviteList} />}
      {selectedHeader === HeaderStatus.ROOM && <CreateRoomModal closeModal={closeModal} />}
    </div>
  );
};

export default LobbyHeader;
