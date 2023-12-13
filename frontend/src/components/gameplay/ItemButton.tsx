import { IGameItem } from "./gameitem/gameItemType";

interface GameItemButtonProps {
  item: IGameItem;
  onClick?: () => void;
  className?: string;
}

const GameItemButton: React.FC<GameItemButtonProps> = ({ item, onClick, className }) => {
  return (
    <div
      title={item?.description}
      className={
        "rounded-[10px] hover:cursor-pointer border-[3px] w-[2rem] border-white flex items-center justify-center bg-skyblue aspect-square drop-shadow-textShadow " +
        className
      }
      onClick={onClick}
    >
      {item?.icon({ className: "w-full aspect-square" })}
    </div>
  );
};

export default GameItemButton;
