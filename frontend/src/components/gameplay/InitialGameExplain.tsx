import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import GameDefaultBox from "./DefaultBox";

const targetIdList = ["gameProblemBox", "gameCodeBox", "gameResultBox", "gameItemBox", "gameExecuteBox"];
const targetTextList = [
  "문제 설명란입니다. 문제의 설명과 입력 방식, 출력 요구사항, 제한사항이 적혀있습니다.",
  "코드 작성란입니다. 문제를 해결하기 위한 코드를 작성해주세요. 이곳에 온갖 방해가 닥쳐올 위기입니다!",
  "결과 확인란입니다. 코드를 실행하고 나온 결과를 확인할 수 있습니다.",
  "아이템 상자입니다. 마우스를 올리면 아이템이 어떤게 있나 확인할 수 있고 클릭하면 아이템을 사용할 수 있습니다.",
  "코드 실행 버튼입니다. 코드를 작성하고 실행해보세요! 실행버튼은 콘솔출력 또한 포함됩니다. 최종제출은 제출 버튼을 눌러주세요!",
];
const getProperPos = (idx: number, currentTargetInfo: ElementInfo) => {
  switch (idx) {
    case 0:
      return {
        left: `calc(${currentTargetInfo.x + currentTargetInfo.width}px + 1rem)`,
        top: `calc(${currentTargetInfo.y}px - 1rem)`,
      };
    case 1:
      return {
        left: `calc(${currentTargetInfo.x}px - 13rem)`,
        top: `calc(${currentTargetInfo.y}px - 1rem)`,
      };
    case 2:
      return {
        left: `calc(${currentTargetInfo.x}px - 13rem)`,
        top: `calc(${currentTargetInfo.y}px - 1rem)`,
      };
    case 3:
      return {
        left: `calc(${currentTargetInfo.x + currentTargetInfo.width}px + 1rem)`,
        top: `calc(${currentTargetInfo.y - currentTargetInfo.height}px - 10rem)`,
      };
    case 4:
      return {
        left: `calc(${currentTargetInfo.x}px - 10rem)`,
        top: `calc(${currentTargetInfo.y}px - 13rem)`,
      };
  }
};

interface ElementInfo {
  x: number;
  y: number;
  width: number;
  height: number;
}

const InitialGameExplain: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentTargetInfo, setCurrentTargetInfo] = useState<ElementInfo>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (localStorage.getItem("isInitialGameExplain") === "true") return;
    const handleNext = () => {
      setCurrentIdx(idx => idx + 1);
    };
    document.addEventListener("click", handleNext);
    document.addEventListener("keydown", handleNext);

    return () => {
      document.removeEventListener("click", handleNext);
      document.removeEventListener("keydown", handleNext);
    };
  }, []);

  useEffect(() => {
    if (localStorage.getItem("isInitialGameExplain") === "true") return;
    const target = document.getElementById(targetIdList[currentIdx]);
    if (!target) return;
    setCurrentTargetInfo(target.getBoundingClientRect());

    window.addEventListener("resize", () => {
      setCurrentTargetInfo(target.getBoundingClientRect());
    });
  }, [currentIdx]);

  // 애니메이션 때문에 초기 절대값을 설정해줘야하는 이슈 존재
  useEffect(() => {
    if (localStorage.getItem("isInitialGameExplain") === "true") return;
    const target = document.getElementById(targetIdList[currentIdx]);
    if (!target) return;
    const [x, y, width, height] = [target.offsetLeft, target.offsetTop, target.offsetWidth, target.offsetHeight];

    setCurrentTargetInfo({ x, y, width, height });
  }, []);

  if (localStorage.getItem("isInitialGameExplain") === "true") return null;

  if (currentIdx > targetIdList.length - 1) {
    localStorage.setItem("isInitialGameExplain", "true");
    return null;
  }

  // 순서대로 설명란 좌 우 상 하
  return createPortal(
    <>
      <div className="absolute z-50 top-0 left-0" style={getProperPos(currentIdx, currentTargetInfo)}>
        <GameDefaultBox className="relative flex justify-center items-center text-black text-[0.75rem] border-4 h-fit w-[12rem] whitespace-pre-wrap ">
          {targetTextList[currentIdx]}
          <div className="absolute bottom-0 right-0 bg-white rounded-md p-0.5">
            {currentIdx + 1} / {targetTextList.length}
          </div>
        </GameDefaultBox>
      </div>
      <div
        className="absolute z-40 flex justify-center items-center w-full h-full bg-black/50"
        style={{
          left: 0,
          top: 0,
          width: currentTargetInfo.x,
        }}
      ></div>
      <div
        className="absolute z-40 flex justify-center items-center w-full h-full bg-black/50"
        style={{
          right: 0,
          top: 0,
          width: window.innerWidth - currentTargetInfo.x - currentTargetInfo.width,
        }}
      ></div>
      <div
        className="absolute z-40 flex justify-center items-center w-full h-full bg-black/50"
        style={{
          left: currentTargetInfo.x,
          top: 0,
          width: currentTargetInfo.width,
          height: currentTargetInfo.y,
        }}
      ></div>
      <div
        className="absolute z-40 flex justify-center items-center w-full h-full bg-black/50"
        style={{
          left: currentTargetInfo.x,
          bottom: 0,
          width: currentTargetInfo.width,
          height: window.innerHeight - currentTargetInfo.y - currentTargetInfo.height,
        }}
      ></div>
    </>,
    document.body,
  );
};

export default InitialGameExplain;
