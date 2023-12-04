import { useEffect, useState } from "react";
import { useLoginStore } from "../../store/useLogin";
import { hashAvatarIdx } from "../../utils/avatar";

const LobbyMyInfo: React.FC = () => {
  const { userName } = useLoginStore();
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (userName) {
      import(`../../assets/avatar/${hashAvatarIdx(userName)}.webp`).then(res => {
        setAvatar(res.default);
      });
    }
  }, [userName]);

  return (
    <div className=" min-w-max flex flex-row items-center gap-4 border-[3px] border-white text-white rounded-lg bg-skyblue p-2">
      <img
        className="bg-pink border-[3px] object-cover border-white rounded-full h-[4rem] aspect-square "
        src={avatar}
      ></img>
      <div>
        <p>{userName}</p>
      </div>
    </div>
  );
};

export default LobbyMyInfo;
