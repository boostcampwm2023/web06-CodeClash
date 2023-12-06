import { useEffect, useState } from "react";
import { useLoginStore } from "../../store/useLogin";
import { hashAvatarIdx } from "../../utils/avatar";
import { getUserStat } from "../../api/user";
import { getPercentage } from "../../utils/calc";

interface IUserStat {
  acceptCount: number;
  failCount: number;
  winCount: number;
  totalCount: number;
}

const LobbyMyInfo: React.FC = () => {
  const { userName } = useLoginStore();
  const [userStat, setUserStat] = useState<IUserStat>();
  const [avatar, setAvatar] = useState<string>("");

  useEffect(() => {
    if (userName) {
      import(`../../assets/avatar/${hashAvatarIdx(userName)}.webp`).then(res => {
        setAvatar(res.default);
      });
    }

    getUserStat(userName).then(res => {
      const { acceptCount, failCount, winCount, totalCount } = res;
      setUserStat({ acceptCount, failCount, winCount, totalCount });
    });
  }, [userName]);

  const myStat = () => {
    if (!userStat) return;
    const { acceptCount, failCount, winCount, totalCount } = userStat;
    return (
      <div className="grid grid-cols-2">
        <p className="tracking-[1rem]">승률</p>
        <p className="text-end">{`${getPercentage(winCount, totalCount)} %`}</p>
        <p>정답률</p>
        <p className="text-end">{`${getPercentage(acceptCount, acceptCount + failCount)} %`}</p>
      </div>
    );
  };

  return (
    <div className=" min-w-max flex flex-row items-center gap-4 border-[3px] border-white text-white rounded-lg bg-skyblue p-2">
      <img
        className="bg-pink border-[3px] object-cover border-white rounded-full h-[4rem] aspect-square "
        src={avatar}
      ></img>
      <div className="flex flex-col">
        <div>{userName}</div>
        {myStat()}
      </div>
    </div>
  );
};

export default LobbyMyInfo;
