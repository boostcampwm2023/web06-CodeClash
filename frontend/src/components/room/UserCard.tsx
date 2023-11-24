import { IUserInfo } from "../../pages/RoomPage";
import ReadyMark from "./ReadyMark";

const RoomUserCard: React.FC<IUserInfo> = ({ userName, isHost, ready }) => {
  return (
    <div className="text-center relative flex flex-col items-center justify-between p-2 border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="w-full border-b-8 border-white">{userName ? (isHost ? "방장" : "플레이어") : "대기중"}</div>
      {userName && (
        <>
          <div className="bg-lightskyblue flex-grow max-w-[80%] m-2 aspect-square rounded-full"></div>
          <p>{userName}</p>
          {ready && <ReadyMark />}
        </>
      )}
    </div>
  );
};

export default RoomUserCard;
