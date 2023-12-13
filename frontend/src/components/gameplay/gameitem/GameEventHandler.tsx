import { useEffect, useReducer, useState } from "react";
import ScreenBlock from "./gameScreenEffect/ScreenBlock";
import { useSocketStore } from "../../../store/useSocket";
import GameFooterBox from "../FooterBox";
import CodeEditor from "../CodeEditor";
import { GameItemType, IGameItem, gameItemTypes } from "./gameItemType";
import { gameItemReducer, initialGameItemState } from "./gameItemReducer";
import { gameItemHandler } from "./gameItemHandler";
import { engToKor, korToEng } from "korsearch";
import EyeStolen from "./gameScreenEffect/EyeStolen";
import { ProblemType } from "../problemType";
import { useRoomStore } from "../../../store/useRoom";
import BarEffect from "../../common/BarEffect";
import { useLoginStore } from "../../../store/useLogin";
import Modal from "../../common/Modal";
import GameTimer from "../ProblemIdx";
import { useNavigate } from "react-router-dom";
import { useToastStore } from "../../../store/useToast";

interface GameEventHandlerProps {
  problemInfo: ProblemType;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

const GameEventHandler: React.FC<GameEventHandlerProps> = ({ problemInfo, code, setCode, setResult }) => {
  const [gameItems, setGameItems] = useState<IGameItem[]>([]);
  const [gameEventState, disPatchEventState] = useReducer(gameItemReducer, initialGameItemState);
  const [isSolved, setIsSolved] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { socket } = useSocketStore();
  const { roomId, userList } = useRoomStore();
  const [modalState, setModalState] = useState({
    isShow: false,
    title: "",
    content: "",
  });
  const handleGameEvent = gameItemHandler(setCode, disPatchEventState, userList.length);
  const navigate = useNavigate();

  const { toast } = useToastStore();

  const handleSubmit = (isExample: boolean) => {
    if (isLoading) {
      setModalState({
        isShow: true,
        title: "잠시만 기다려주세요.",
        content: "채점 중입니다.",
      });
      return;
    }

    if (isSolved) {
      setModalState({
        isShow: true,
        title: "이미 통과한 문제입니다.",
        content: "다른 유저가 완료할때까지 기다려주세요.",
      });
      return;
    }

    socket?.emit("submission", { id: problemInfo.id, code, isExample }, (res: any) => {
      if (res?.message) {
        alert(res?.message);
        return;
      }

      if (!isExample && res?.passed) {
        setIsSolved(true);
      }

      setIsLoading(true);
      setResult(
        res?.results.map((data: any, idx: number) => {
          return isExample
            ? `${idx + 1}번째 문제 : ${data.status === "pass" ? "통과" : "실패"} memory:${data.memory}mb 실행시간:${
                data.runTime
              }ms\n${data.output ? "출력 : " + data.output : ""}${data.error ? "에러 : " + data.error : ""}`
            : `${idx + 1}번째 문제 : ${data.status === "pass" ? "통과" : "실패"} memory:${data.memory}mb 실행시간:${
                data.runTime
              }ms\n`;
        }),
      );

      setIsLoading(false);
    });
  };

  const handleCreateItem = ({ item }: { item: number }) => {
    if (item) {
      setGameItems(gameitems => {
        return [...gameitems, gameItemTypes[item]];
      });
    }
  };

  const handleCountdown = () => {
    toast("카운트다운이 시작되었습니다!");
    setIsCountdown(true);
  };

  const handleGameover = () => {
    navigate("/result");
  };

  // 언어 뒤집기
  useEffect(() => {
    if (gameEventState.isReverseLanguage) {
      setCode(engToKor(code));
    } else {
      setCode(korToEng(code));
    }
  }, [gameEventState.isReverseLanguage]);

  useEffect(() => {
    const handleGameItem = (data: { item: GameItemType; userName: string }) => {
      toast(`${data.userName}님이 ${gameItemTypes[data.item].name}을(를) 사용했습니다.`);
      handleGameEvent(data.item);
    };

    socket?.on("item", handleGameItem);

    return () => {
      socket?.off("item");
    };
  }, [socket]);

  useEffect(() => {
    const keyDownHandler = ({ key }: KeyboardEvent) => {
      if (key === "Alt") {
        setGameItems(gameitems => {
          if (gameitems.length === 0 || !socket) return gameitems;
          socket.emit("item", { roomId, item: gameitems[0].type });
          return gameitems.slice(1);
        });
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("game_over", handleGameover);
    socket?.on("countdown", handleCountdown);
    socket?.on("create_item", handleCreateItem);

    return () => {
      socket?.off("game_over");
      socket?.off("countdown");
      socket?.off("create_item");
    };
  }, [socket]);

  return (
    <>
      <GameTimer isTimerStart={isCountdown} />
      {modalState.isShow && (
        <Modal title={modalState.title} closeModal={() => setModalState(state => ({ ...state, isShow: false }))}>
          <div>{modalState.content}</div>
        </Modal>
      )}
      <CodeEditor
        editorCode={code}
        setEditorCode={setCode}
        options={{
          isReverse: gameEventState.isReverseLanguage,
          fontSize: gameEventState.fontSize,
          isTypeRandom: gameEventState.isTypeRandom,
        }}
        initialCode={problemInfo?.sampleCode ?? ""}
      />
      <BarEffect isStart={isSolved} content="통과!" subContent="다른 유저가 완료할때까지 기다려주세요." />
      <GameFooterBox
        handleGradeSubmit={() => handleSubmit(false)}
        handleExampleSubmit={() => handleSubmit(true)}
        items={gameItems}
      />
      {gameEventState.isScreenBlock && <ScreenBlock />}
      {gameEventState.isEyeStolen && <EyeStolen />}
    </>
  );
};

export default GameEventHandler;
