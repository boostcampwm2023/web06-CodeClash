import { useLoginStore } from "../../store/useLogin";

const LobbyMyInfo: React.FC = () => {
  const { userName } = useLoginStore();
  return (
    <div className=" min-w-max flex flex-row items-center gap-4 border-[3px] border-white text-white rounded-lg bg-skyblue p-2">
      <div className="bg-pink border-[3px] border-white rounded-full h-[4rem] aspect-square "></div>
      <div>
        <p>{userName}</p>
      </div>
    </div>
  );
};

export default LobbyMyInfo;
