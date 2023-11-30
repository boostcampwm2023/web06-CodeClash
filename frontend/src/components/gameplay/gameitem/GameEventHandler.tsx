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
import { postProblemGrade } from "../../../api/problem";
import { ProblemType } from "../problemType";
import { useRoomStore } from "../../../store/useRoom";

const MAX_GAME_ITEM = 2;
const USER_COUNT = 3;

interface GameEventHandlerProps {
  problemInfo: ProblemType;
  code: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  setResult: React.Dispatch<React.SetStateAction<string>>;
}

const GameEventHandler: React.FC<GameEventHandlerProps> = ({ problemInfo, code, setCode, setResult }) => {
  const [gameItems, setGameItems] = useState<IGameItem[]>([]);
  const [gameEventState, disPatchEventState] = useReducer(gameItemReducer, initialGameItemState);
  const { socket } = useSocketStore();
  const { roomId } = useRoomStore();

  const handleGameEvent = gameItemHandler(setCode, disPatchEventState, USER_COUNT);

  const handleGradeSubmit = () => {
    postProblemGrade(problemInfo.id, code).then(res => {
      setResult(
        res?.data.map((data: any, idx: number) => {
          return `${idx + 1}번째 문제 : ${data.status === "pass" ? "통과" : "실패"} memory:${data.memory}mb 실행시간:${
            data.runTime
          }ms\n`;
        }),
      );
    });
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
    const intervalId = setInterval(() => {
      setGameItems(prev => {
        if (prev.length < MAX_GAME_ITEM) {
          const randomIdx = Math.floor(Math.random() * gameItemTypes.length);
          return prev.concat(gameItemTypes[randomIdx]);
        }
        return prev;
      });
    }, 1000 * 1);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const gameItemHandler = (data: { item: GameItemType; userName: string }) => {
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

  return (
    <>
      <CodeEditor
        editorCode={code}
        setEditorCode={setCode}
        options={{
          isReverse: gameEventState.isReverseLanguage,
          fontSize: gameEventState.fontSize,
          isTypeRandom: gameEventState.isTypeRandom,
        }}
        initialCode={problemInfo?.sampleCode}
      />
      <GameFooterBox handleGradeSubmit={handleGradeSubmit} items={gameItems} />
      {gameEventState.isScreenBlock && <ScreenBlock />}
      {gameEventState.isEyeStolen && <EyeStolen />}
    </>
  );
};

export default GameEventHandler;
