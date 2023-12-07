import { useEffect, useState } from "react";

interface GameProblemIdxProps {
  isTimerStart: boolean;
}

const GameTimer: React.FC<GameProblemIdxProps> = ({ isTimerStart }) => {
  const [time, setTime] = useState("타이머");
  useEffect(() => {
    if (isTimerStart) {
      setTime("30초");
      const timer = setInterval(() => {
        setTime(prev => {
          if (prev === "1초") clearInterval(timer);
          const time = parseInt(prev) - 1;
          return time.toString() + "초";
        });
      }, 1000);
      return () => {
        clearInterval(timer);
      };
    }
  }, [isTimerStart]);
  return (
    <div className="absolute top-3 left-[50%] -translate-x-[50%] w-fit">
      <div className="absolute w-full h-full z-10">
        <div className="absolute h-full w-full bg-pink rounded-sm skew-x-right -right-2 border-[3px] border-b-0 "></div>
        <div className="absolute h-full w-full bg-pink rounded-sm skew-x-left -left-2 border-[3px] border-r-0 border-b-0 "></div>
      </div>
      <div className="absolute w-full h-full z-0 bottom-[-8px]">
        <div className="absolute h-full w-full bg-black rounded-sm skew-x-right -right-2 z-0 border-[3px]"></div>
        <div className="absolute h-full w-full bg-black rounded-sm skew-x-left -left-2 z-0 border-[3px] border-r-0"></div>
      </div>
      <p className="relative drop-shadow-textShadow  text-white p-1 z-20">{time}</p>
    </div>
  );
};

export default GameTimer;
