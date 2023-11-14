import Button from "../common/Button";
import GameItemButton from "./GameItemButton";

const GameFooterBox: React.FC = () => {
  return (
    <footer className="absolute right-0 bottom-0">
      <div className="absolute h-full w-full bg-black rounded-tl-md skew-x-left -left-2 z-0"></div>
      <div className="relative bg-black px-2 py-1 flex flex-row text-[24px] gap-12 z-10">
        <div className="flex flex-row ">
          <GameItemButton item="swap" className="mr-1" />
          <GameItemButton item="swap" />
          <div className="ml-1 text-[10px] text-[#AAAAAA] flex flex-col items-start justify-end">
            <p>아이콘을 눌러</p>
            <p>아이템을 사용해보세요!</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-1 text-[24px]">
          <Button title="실행" color="yellow" className="py-[0.25em] px-5 border-[3px] rounded-[12px]"></Button>
          <Button title="제출" color="pink" className="py-[0.25em] px-5 border-[3px] rounded-[12px]"></Button>
        </div>
      </div>
    </footer>
  );
};

export default GameFooterBox;
