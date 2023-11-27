import { useNavigate } from "react-router-dom";

const LobbyMyInfo: React.FC = () => {
  return (
    <div className=" min-w-max flex flex-row items-center gap-4 border-[3px] border-white text-white rounded-lg bg-skyblue p-2">
      <div className="bg-pink border-[3px] border-white rounded-full h-[4rem] aspect-square "></div>
      <div>
        <p>양평군첨벙펀치</p>
        <p>승률 {99.8}%</p>
      </div>
    </div>
  );
};

export default LobbyMyInfo;
