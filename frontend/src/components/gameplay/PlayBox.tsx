import GameDefaultBox from "./DefaultBox";
import { useState, DragEventHandler } from "react";
import GameEventHandler from "./gameitem/GameEventHandler";
import convertRemToPixels from "../../utils/convertRemToPixels";
import { ProblemType } from "./problemType";
import MarkdownPreview from "@uiw/react-markdown-preview";

interface GamePlayBoxProps {
  problemInfo: ProblemType;
}

const GamePlayBox: React.FC<GamePlayBoxProps> = ({ problemInfo }) => {
  const [problemBoxWidth, setProblemBoxWidth] = useState<number>(35);
  const [codeBoxHeight, setCodeBoxHeight] = useState<number>(70);
  const [code, setCode] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const dragProblemBoxHandler: DragEventHandler<HTMLDivElement> = ({ clientX }) => {
    if (clientX > 0 && clientX < window.innerWidth)
      setProblemBoxWidth(((clientX - convertRemToPixels(0.5)) / (window.innerWidth - convertRemToPixels(1))) * 100);
  };

  const dragCodeBoxHandler: DragEventHandler<HTMLDivElement> = ({ clientY }) => {
    if (clientY > 0 && clientY < window.innerHeight)
      setCodeBoxHeight(((clientY - convertRemToPixels(3.5)) / (window.innerHeight - convertRemToPixels(7))) * 100);
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div
        style={{
          width: `${problemBoxWidth}%`,
        }}
        id="gameProblemBox"
      >
        <GameDefaultBox>
          <MarkdownPreview source={problemInfo?.description} className=" rounded-sm w-full h-full" />
        </GameDefaultBox>
      </div>

      <div className="w-2 flex items-center justify-center cursor-pointer" onDrag={dragProblemBoxHandler}></div>
      <div
        className="flex flex-col w-full h-full"
        style={{
          width: `${100 - problemBoxWidth}%`,
        }}
      >
        <div
          style={{
            height: `${codeBoxHeight}%`,
          }}
          id="gameCodeBox"
        >
          <GameDefaultBox>
            <GameEventHandler problemInfo={problemInfo} code={code} setCode={setCode} setResult={setResult} />
          </GameDefaultBox>
        </div>
        <div className="h-2 items-center justify-center cursor-pointer" onDrag={dragCodeBoxHandler}></div>
        <div
          style={{
            height: `${100 - codeBoxHeight}%`,
          }}
          id="gameResultBox"
        >
          <GameDefaultBox className="whitespace-pre-line">{result}</GameDefaultBox>
        </div>
      </div>
    </div>
  );
};

export default GamePlayBox;
