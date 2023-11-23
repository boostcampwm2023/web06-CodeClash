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

const MAX_GAME_ITEM = 999;

const GameEventHandler: React.FC = () => {
  const [gameItems, setGameItems] = useState<IGameItem[]>([]);
  const [code, setCode] = useState("");
  const { socket } = useSocketStore();
  const [gameEventState, disPatchEventState] = useReducer(gameItemReducer, initialGameItemState);

  const handleGameEvent = gameItemHandler(setCode, disPatchEventState);

  useEffect(() => {
    if (gameEventState.isReverseLanguage) {
      setCode(engToKor(code));
    } else {
      setCode(korToEng(code));
    }
  }, [gameEventState.isReverseLanguage]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameItems.length < MAX_GAME_ITEM) {
        setGameItems(prev => [...prev, gameItemTypes[Math.floor(Math.random() * gameItemTypes.length)]]);
      }
    }, 1000 * 1);
    //dev
    const keyDownHandler = ({ key }: KeyboardEvent) => {
      if (key === "Control") {
        handleGameEvent(Number(prompt("아이템 인덱스 입력")) ?? GameItemType.SWAP);
      }
    };
    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const gameItemHandler = (data: { type: GameItemType }) => {
      handleGameEvent(data.type);
    };

    socket?.on("game-item", gameItemHandler);

    return () => {
      socket?.off("game-item");
    };
  }, [socket]);

  useEffect(() => {
    const keyDownHandler = ({ key }: KeyboardEvent) => {
      if (key === "Control" && socket?.connected && gameItems.length > 0) {
        socket.emit("game-item", { type: gameItems[0] });
        setGameItems(gameItems.slice(1));
      }
    };
    socket?.connected && document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [socket]);

  return (
    <>
      <CodeEditor
        editorCode={code}
        setEditorCode={setCode}
        options={{ isReverse: gameEventState.isReverseLanguage, fontSize: gameEventState.fontSize }}
      />
      <GameFooterBox />
      {gameEventState.isScreenBlock && <ScreenBlock />}
      {gameEventState.isEyeStolen && <EyeStolen />}
    </>
  );
};

export default GameEventHandler;
