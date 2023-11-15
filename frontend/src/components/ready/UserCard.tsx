import ReadyMark from "./ReadyMark";

interface UserCardProps {
  username: string;
  isHost: boolean;
  readyState: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ username, isHost, readyState }) => {
  return (
    <div className="text-center relative p-2 h-[391px] border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="border-b-8 border-white">{username ? (isHost ? "방장" : "플레이어") : "대기중"}</div>
      {username ? (
        <>
          <div className="h-28 flex justify-center items-center">
            <div className="bg-lightskyblue w-20 h-20 rounded-full"></div>
          </div>
          <div className="">{username}</div>
          {readyState && <ReadyMark />}
        </>
      ) : null}
    </div>
  );
};

export default UserCard;
