import { IUserInfo } from "../../pages/RoomPage";
import ReadyMark from "./ReadyMark";

const RoomUserCard: React.FC<IUserInfo> = ({ userName, isHost, ready }) => {
  return (
    <div className="text-center relative p-2 h-[391px] border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="border-b-8 border-white">{userName ? (isHost ? "방장" : "플레이어") : "대기중"}</div>
      {userName ? (
        <>
          <div className="h-28 flex justify-center items-center">
            <div className="bg-lightskyblue w-20 h-20 rounded-full"></div>
          </div>
          <div className="">{userName}</div>
          {ready && <ReadyMark />}
        </>
      ) : null}
    </div>
  );
};

export default RoomUserCard;
