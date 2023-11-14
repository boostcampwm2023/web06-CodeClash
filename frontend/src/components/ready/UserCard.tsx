import ReadyMark from "./ReadyMark";

interface IUserCardProps {
  username?: string;
  isHost: boolean;
  readyState: boolean;
}

const UserCard: React.FC<IUserCardProps> = ({ username, isHost, readyState }) => {
  return (
    <div className="text-center relative p-2 h-[391px] border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="border-b-8 border-white">{isHost ? "방장" : "플레이어"}</div>
      <div className="h-28 flex justify-center items-center">
        <div className="bg-lightskyblue w-20 h-20 rounded-full"></div>
      </div>
      <div className="">{username}</div>
      {readyState && <ReadyMark />}
    </div>
  );
};

export default UserCard;
