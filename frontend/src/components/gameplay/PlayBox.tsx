import GameDefaultBox from "./DefaultBox";
import { useState, DragEventHandler } from "react";
import GameEventHandler from "./gameitem/GameEventHandler";
import convertRemToPixels from "../../utils/convertRemToPixels";
import { ProblemType } from "./problemType";

const OriginalResizeObserver = window.ResizeObserver;

window.ResizeObserver = function (callback: any) {
  const wrappedCallback = (entries: any, observer: any) => {
    window.requestAnimationFrame(() => {
      callback(entries, observer);
    });
  };

  // Create an instance of the original ResizeObserver
  // with the wrapped callback
  return new OriginalResizeObserver(wrappedCallback);
} as any;

for (let staticMethod in OriginalResizeObserver) {
  if (OriginalResizeObserver.hasOwnProperty(staticMethod)) {
    window.ResizeObserver[staticMethod as keyof typeof OriginalResizeObserver] = OriginalResizeObserver[
      staticMethod as keyof typeof OriginalResizeObserver
    ] as any;
  }
}

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
      >
        <GameDefaultBox>
          <p>{problemInfo?.description}</p>
          <div className="my-8">
            {problemInfo?.testcases.map((testcase, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <p>입력 예시 {index + 1}: </p>
                <p>{testcase.input}</p>
              </div>
            ))}
          </div>
          <div className="my-8">
            {problemInfo?.testcases.map((testcase, index) => (
              <div key={index} className="flex flex-row items-center gap-2">
                <p>출력 예시 {index + 1}: </p>
                <p>{testcase.output}</p>
              </div>
            ))}
          </div>
          <div className="my-8">
            <p>메모리 제한: {problemInfo?.memoryLimit}mb</p>
            <p>시간 제한: {problemInfo?.timeLimit}ms</p>
          </div>
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
        >
          <GameDefaultBox className="whitespace-pre-line">{result}</GameDefaultBox>
        </div>
      </div>
    </div>
  );
};

export default GamePlayBox;
