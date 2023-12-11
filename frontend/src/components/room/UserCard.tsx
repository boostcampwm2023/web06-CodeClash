import { useEffect, useState } from "react";
import { UserInfo, useRoomStore } from "../../store/useRoom";
import ReadyMark from "./ReadyMark";
import { hashAvatarIdx } from "../../utils/avatar";
import { useLoginStore } from "../../store/useLogin";
import { useSocketStore } from "../../store/useSocket";

interface RoomUserCardProps extends UserInfo {
  isHost: boolean;
}

const RoomUserCard: React.FC<RoomUserCardProps> = ({ userName, isHost, ready }) => {
  const { userName: currUserName } = useLoginStore();
  const { userList } = useRoomStore();
  const { socket } = useSocketStore();
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (userName === "대기중...") return;
    if (userName) {
      import(`../../assets/avatar/${hashAvatarIdx(userName)}.webp`).then(res => {
        setAvatar(res.default);
      });
    }
  }, [userName]);

  const banCondition = () => {
    if (isHost) return false;
    if (userName === "대기중...") return false;
    if (currUserName !== userList[0].userName) return false;
    return true;
  };

  const handleBan = () => {
    socket?.emit("kick", { userName });
  };

  return (
    <div className="relative w-full h-full text-center flex flex-col items-center justify-between p-2 border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="w-full border-b-8 border-white">
        {(userName ? (isHost ? "방장" : "플레이어") : "대기중") + (userName === currUserName ? "(나)" : "")}
      </div>
      {userName && (
        <>
          <div className="border-[2px] w-full h-full border-white object-cover m-2 rounded-full overflow-hidden">
            <img className="w-full h-full object-cover" src={avatar}></img>
          </div>
          <p>{userName}</p>
          {ready && <ReadyMark />}
        </>
      )}
      {banCondition() && (
        <button onClick={handleBan} className="absolute top-1 right-1 text-pink">
          강퇴
        </button>
      )}
    </div>
  );
};

export default RoomUserCard;
