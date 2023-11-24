interface GameItemButtonProps {
  item: "swap";
  onClick?: () => void;
  className?: string;
}

const GameItemButton: React.FC<GameItemButtonProps> = ({ item, onClick, className }) => {
  return (
    <div
      className={
        "rounded-[10px] hover:cursor-pointer border-[3px] border-white flex items-center justify-center bg-skyblue aspect-square drop-shadow-textShadow " +
        className
      }
      onClick={onClick}
    >
      {item}
    </div>
  );
};

export default GameItemButton;
