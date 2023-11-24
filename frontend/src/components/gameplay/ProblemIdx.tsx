interface GameProblemIdxProps {
  currentIdx: number;
  totalIdx: number;
}

const GameProblemIdx: React.FC<GameProblemIdxProps> = ({ currentIdx, totalIdx }) => {
  return (
    <div className="relative w-fit">
      <div className="absolute w-full h-full z-10">
        <div className="absolute h-full w-full bg-pink rounded-sm skew-x-right -right-2 border-[3px] border-b-0 "></div>
        <div className="absolute h-full w-full bg-pink rounded-sm skew-x-left -left-2 border-[3px] border-r-0 border-b-0 "></div>
      </div>
      <div className="absolute w-full h-full z-0 bottom-[-8px]">
        <div className="absolute h-full w-full bg-black rounded-sm skew-x-right -right-2 z-0 border-[3px]"></div>
        <div className="absolute h-full w-full bg-black rounded-sm skew-x-left -left-2 z-0 border-[3px] border-r-0"></div>
      </div>
      <p className="relative drop-shadow-textShadow  text-white p-1 z-20">
        {currentIdx}/{totalIdx}
      </p>
    </div>
  );
};

export default GameProblemIdx;
