import GameDefaultBox from "./DefaultBox";
import { useState, DragEventHandler } from "react";
import GameEventHandler from "./gameitem/GameEventHandler";

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

const GamePlayBox: React.FC = () => {
  const [problemBoxWidth, setProblemBoxWidth] = useState<number>(35);
  const [codeBoxHeight, setCodeBoxHeight] = useState<number>(70);

  const convertRemToPixels = (rem: number) => {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  };

  const dragProblemBoxHandler: DragEventHandler<HTMLDivElement> = e => {
    if (e.clientX > 0 && e.clientX < window.innerWidth)
      setProblemBoxWidth(((e.clientX - convertRemToPixels(0.5)) / (window.innerWidth - convertRemToPixels(1))) * 100);
  };

  const dragCodeBoxHandler: DragEventHandler<HTMLDivElement> = e => {
    if (e.clientY > 0 && e.clientY < window.innerHeight)
      setCodeBoxHeight(((e.clientY - convertRemToPixels(3.5)) / (window.innerHeight - convertRemToPixels(7))) * 100);
  };

  return (
    <div className="flex flex-row w-full h-full">
      <div
        style={{
          width: `${problemBoxWidth}%`,
        }}
      >
        <GameDefaultBox>
          <div></div>
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
            <GameEventHandler />
          </GameDefaultBox>
        </div>
        <div className="h-2 items-center justify-center cursor-pointer" onDrag={dragCodeBoxHandler}></div>
        <div
          style={{
            height: `${100 - codeBoxHeight}%`,
          }}
        >
          <GameDefaultBox>
            <div></div>
          </GameDefaultBox>
        </div>
      </div>
    </div>
  );
};

export default GamePlayBox;
