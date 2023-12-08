import { useEffect, useState } from "react";
import SlidePage from "../components/common/SlidePage";
import GameHeaderBox from "../components/gameplay/HeaderBox";
import CodeViewerBox from "../components/result/CodeViewerBox";
import ResultSummaryBox from "../components/result/SummaryBox";
import { getLastSubmission } from "../api/user";
import { useRoomStore } from "../store/useRoom";
import { useSocketStore } from "../store/useSocket";
import { useLoginStore } from "../store/useLogin";

const ResultPage: React.FC = () => {
  const { userName } = useLoginStore();
  const { problemList, setIsStart } = useRoomStore();
  /// {"faker":["1번 코드","2번 코드"],"faker2":["1번 코드","2번 코드"]}
  const [userCode, setUserCode] = useState<Record<string, { title: string; code: string }[]>>({});
  const [userScore, setUserScore] = useState<Record<string, number>>({});
  const [selectedUser, setSelectedUser] = useState<string>(userName);
  const { socket } = useSocketStore();

  const handleResultInfo = (res: {
    status: string;
    resultInfo: {
      userName: string;
      ranking: number;
    }[];
  }) => {
    if (res.status === "success") {
      const { resultInfo } = res;
      setUserScore(
        resultInfo.reduce(
          (acc, cur) => {
            acc[cur.userName] = cur.ranking;
            return acc;
          },
          {} as Record<string, number>,
        ),
      );
      Promise.all(
        resultInfo
          .sort((a, b) => a.ranking - b.ranking)
          .map(user => {
            return getLastSubmission(user.userName, problemList[0].id, problemList[0].title);
          }),
      ).then(res => {
        setUserCode(
          res.reduce(
            (acc, cur) => {
              const userName = cur?.userName ?? "";
              if (!acc[userName]) acc[userName] = [];
              acc[userName].push({
                title: cur?.title ?? "",
                code: cur?.res.data.code ?? "",
              });
              return acc;
            },
            {} as Record<string, { title: string; code: string }[]>,
          ),
        );
      });
    }
  };

  useEffect(() => {
    socket?.emit("result_info", handleResultInfo);
  }, [socket]);

  return (
    <SlidePage className="flex justify-center items-center w-full h-full gap-3 p-12">
      <GameHeaderBox title="결과" />
      <div className="w-[35%] min-w-[15rem] h-full flex flex-col justify-center gap-2 text-white">
        <ResultSummaryBox userScore={userScore} selectedUser={selectedUser} setSelecteduser={setSelectedUser} />
      </div>
      <div className="w-full h-full flex flex-col items-center gap-3">
        <CodeViewerBox codeList={userCode[selectedUser]} />
      </div>
    </SlidePage>
  );
};

export default ResultPage;
