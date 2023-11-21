import Button from "../common/Button";
import { useState } from "react";
import InviteModal from "./InviteModal";

enum HeaderStatus {
  LOBBY = "lobby",
  MYINFO = "myinfo",
  NOTIFICATION = "notification",
  ROOM = "room",
}

export interface Iinvite {
  roomName: string;
  host: string;
}

const tempInviteList = [
  {
    roomName: "파이썬 1:1 초보만@@@@@@@@",
    host: "알파고",
  },
  {
    roomName: "파이썬 1:1 초보만@@@@@@@@@@",
    host: "홍구",
  },
  {
    roomName: "파이썬 1:1 초보만@@@@@@@@@@@@",
    host: "택신",
  },
  {
    roomName: "파이썬 1:1 초보만@@@@",
    host: "이제동",
  },
  {
    roomName: "파이썬 1:1 초보만@@@@@@@",
    host: "짭제",
  },
];

const LobbyHeader: React.FC = () => {
  const [selectedHeader, setSelectedHeader] = useState<HeaderStatus>(HeaderStatus.LOBBY);
  const [inviteList, setInviteList] = useState<Iinvite[]>(tempInviteList);

  const closeModal = () => {
    setSelectedHeader(HeaderStatus.LOBBY);
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
        <Button
          color={selectedHeader === HeaderStatus.NOTIFICATION ? "pink" : "skyblue"}
          title="알림"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.NOTIFICATION)}
        />
        <Button
          color={selectedHeader === HeaderStatus.ROOM ? "pink" : "skyblue"}
          title="방"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.ROOM)}
        />
      </div>
      {selectedHeader === HeaderStatus.NOTIFICATION && <InviteModal closeModal={closeModal} inviteList={inviteList} />}
    </div>
  );
};

export default LobbyHeader;
