import { useEffect, useReducer, useState } from "react";
import ScreenBlock from "./ScreenBlock";
import { useSocketStore } from "../../../store/useSocket";
import GameFooterBox from "../FooterBox";
import CodeEditor from "../CodeEditor";
import { GameItemType, IGameItem, gameItemTypes } from "./gameItemType";
import { gameItemReducer, initialGameItemState } from "./gameItemReducer";

const GameEventHandler: React.FC = () => {
  const [gameItems, setGameItems] = useState<IGameItem[]>([]);
  const [code, setCode] = useState("");
  const { socket } = useSocketStore();

  const [gameEventState, disPatchEventState] = useReducer(gameItemReducer, initialGameItemState);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameItems.length < 2) {
        setGameItems(prev => [...prev, gameItemTypes[Math.floor(Math.random() * gameItemTypes.length)]]);
      }
    }, 1000 * 60);
    //dev
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Control") {
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
      switch (data.type) {
        case GameItemType.SWAP:
          break;
      }
    };

    socket?.on("game-item", gameItemHandler);

    return () => {
      socket?.off("game-item");
    };
  }, [socket]);

  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Control" && socket?.connected && gameItems.length > 0) {
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
      {false && <ScreenBlock />}
    </>
  );
};

export default GameEventHandler;
