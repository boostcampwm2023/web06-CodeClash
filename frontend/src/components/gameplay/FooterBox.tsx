import { useRoomStore } from "../../store/useRoom";
import { useSocketStore } from "../../store/useSocket";
import Button from "../common/Button";
import GameItemButton from "./ItemButton";
import { IGameItem } from "./gameitem/gameItemType";

interface GameFooterBoxProps {
  items: IGameItem[];
  setGameItems: React.Dispatch<React.SetStateAction<IGameItem[]>>;
  handleGradeSubmit: () => void;
  handleExampleSubmit: () => void;
}

const GameFooterBox: React.FC<GameFooterBoxProps> = ({
  items,
  handleGradeSubmit,
  handleExampleSubmit,
  setGameItems,
}) => {
  const { socket } = useSocketStore();
  const { roomId } = useRoomStore();

  const handleGameItemUse = (idx: number) => () =>
    setGameItems(gameitems => {
      if (gameitems.length <= idx || !socket) return gameitems;
      socket.emit("item", { roomId, item: gameitems[idx].type });
      return gameitems.filter((_, i) => i !== idx);
    });

  return (
    <footer className="absolute right-0 bottom-0">
      <div className="absolute h-full w-full bg-black rounded-tl-md skew-x-left -left-2 z-0"></div>
      <div className="relative bg-black px-2 py-1 flex flex-row text-[24px] gap-12 z-10">
        <div className="flex flex-row " id="gameItemBox">
          <GameItemButton item={items[0]} className="mr-1" onClick={handleGameItemUse(0)} />
          <GameItemButton item={items[1]} onClick={handleGameItemUse(1)} />
          <div className="ml-1 text-[10px] text-[#AAAAAA] flex flex-col items-start justify-end">
            <p>아이콘을 눌러</p>
            <p>아이템을 사용해보세요!</p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center gap-1 text-[24px]" id="gameExecuteBox">
          <Button
            title="실행"
            color="yellow"
            className="py-[0.25em] px-5 border-[3px] rounded-[12px]"
            onClick={handleExampleSubmit}
          ></Button>
          <Button
            title="제출"
            color="pink"
            className="py-[0.25em] px-5 border-[3px] rounded-[12px]"
            onClick={handleGradeSubmit}
          ></Button>
        </div>
      </div>
    </footer>
  );
};

export default GameFooterBox;
