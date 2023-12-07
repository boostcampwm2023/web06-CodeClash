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
import { postProblemExampleGrade, postProblemGrade } from "../../../api/problem";
import { ProblemType } from "../problemType";
import { useRoomStore } from "../../../store/useRoom";
import BarEffect from "../../common/BarEffect";
import { useLoginStore } from "../../../store/useLogin";
import Modal from "../../common/Modal";

const MAX_GAME_ITEM = 2;

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
  const [isLoading, setIsLoading] = useState(false);
  const { userName } = useLoginStore();
  const { socket } = useSocketStore();
  const { roomId, userList } = useRoomStore();
  const [modalState, setModalState] = useState({
    isShow: false,
    title: "",
    content: "",
  });
  const handleGameEvent = gameItemHandler(setCode, disPatchEventState, userList.length);

  const handleGradeSubmit = () => {
    if (isLoading) return;
    if (isSolved) {
      setModalState({
        isShow: true,
        title: "이미 통과한 문제입니다.",
        content: "다른 유저가 완료할때까지 기다려주세요.",
      });
      return;
    }
    setIsLoading(true);
    postProblemGrade(problemInfo.id, code)
      .then(res => {
        if (res?.data.message) {
          alert(res?.data.message);
          return;
        }
        setResult(
          res?.data.map((data: any, idx: number) => {
            return `${idx + 1}번째 문제 : ${data.status === "pass" ? "통과" : "실패"} memory:${
              data.memory
            }mb 실행시간:${data.runTime}ms\n`;
          }),
        );

        if (res?.data.every((data: any) => data.status === "pass")) {
          setIsSolved(true);
          socket?.emit("pass", { userName });
        }
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleExampleSubmit = () => {
    if (isLoading) return;
    if (isSolved) {
      setModalState({
        isShow: true,
        title: "이미 통과한 문제입니다.",
        content: "다른 유저가 완료할때까지 기다려주세요.",
      });
      return;
    }
    setIsLoading(true);
    postProblemExampleGrade(problemInfo.id, code)
      .then(res => {
        if (res?.data.message) {
          alert(res?.data.message);
          return;
        }
        setResult(
          res?.data.map((data: any, idx: number) => {
            return `${idx + 1}번째 문제 : ${data.status === "pass" ? "통과" : "실패"} memory:${
              data.memory
            }mb 실행시간:${data.runTime}ms\n${data.output ? "출력 : " + data.output : ""}${
              data.error ? "에러 : " + data.error : ""
            }`;
          }),
        );
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCreateItem = (data: any) => {
    console.log("create", data);
    if (data.item) {
      setGameItems(gameitems => {
        return [...gameitems, gameItemTypes[data.item]];
      });
    }
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
    const gameItemHandler = (data: { item: GameItemType; userName: string }) => {
      console.log(data);
      handleGameEvent(data.item);
    };

    socket?.on("item", gameItemHandler);

    return () => {
      socket?.off("item");
    };
  }, [socket]);

  useEffect(() => {
    const keyDownHandler = ({ key }: KeyboardEvent) => {
      if (key === "Control") {
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
    socket?.on("timeover", () => {});
    socket?.on("timerstart", () => {});
    socket?.on("pass", () => {});
    socket?.on("create_item", handleCreateItem);

    return () => {
      socket?.off("timeover");
      socket?.off("timerstart");
      socket?.off("pass");
      socket?.off("item");
    };
  }, [socket]);

  return (
    <>
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
        handleGradeSubmit={handleGradeSubmit}
        handleExampleSubmit={handleExampleSubmit}
        items={gameItems}
      />
      {gameEventState.isScreenBlock && <ScreenBlock />}
      {gameEventState.isEyeStolen && <EyeStolen />}
    </>
  );
};

export default GameEventHandler;
