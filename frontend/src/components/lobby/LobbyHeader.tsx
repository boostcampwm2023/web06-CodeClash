import Button from "../common/Button";
import { useState } from "react";

enum HeaderStatus {
  LOBY = "loby",
  MYINFO = "myinfo",
  NOTIFICATION = "notification",
  ROOM = "room",
}

const LobbyHeader: React.FC = () => {
  const [selectedHeader, setSelectedHeader] = useState<HeaderStatus>(HeaderStatus.LOBY);
  return (
    <div className="absolute top-0 -translate-x-[50%] left-[50%] ">
      <div className="absolute h-full w-full bg-black rounded-b-sm skew-x-left -right-2 z-0"></div>
      <div className="absolute h-full w-full bg-black rounded-b-sm skew-x-right -left-2 z-0 "></div>
      <div className="relative px-4 py-2 grid grid-cols-4 text-[24px] gap-1 z-10 ">
        <Button
          color={selectedHeader === HeaderStatus.LOBY ? "pink" : "skyblue"}
          title="로비"
          className="border-[3px] py-[0.25rem] px-[0.5rem]"
          onClick={() => setSelectedHeader(HeaderStatus.LOBY)}
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
    </div>
  );
};

export default LobbyHeader;
