import { useEffect, useState } from "react";
import { UserInfo } from "../../store/useRoom";
import ReadyMark from "./ReadyMark";
import { hashAvatarIdx } from "../../utils/avatar";

interface RoomUserCardProps extends UserInfo {
  isHost: boolean;
}

const RoomUserCard: React.FC<RoomUserCardProps> = ({ userName, isHost, ready }) => {
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (userName === "대기중...") return;
    if (userName) {
      import(`../../assets/avatar/${hashAvatarIdx(userName)}.webp`).then(res => {
        setAvatar(res.default);
      });
    }
  }, [userName]);
  return (
    <div className="w-full h-full text-center flex flex-col items-center justify-between p-2 border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="w-full border-b-8 border-white">{userName ? (isHost ? "방장" : "플레이어") : "대기중"}</div>
      {userName && (
        <>
          <div className="border-[2px] w-full h-full border-white object-cover m-2 rounded-full overflow-hidden">
            <img className="w-full h-full object-cover" src={avatar}></img>
          </div>
          <p>{userName}</p>
          {ready && <ReadyMark />}
        </>
      )}
    </div>
  );
};

export default RoomUserCard;
