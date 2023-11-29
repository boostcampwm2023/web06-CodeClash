interface GameItemButtonProps {
  item?: React.FC;
  onClick?: () => void;
  className?: string;
}

const GameItemButton: React.FC<GameItemButtonProps> = ({ item = () => <></>, onClick, className }) => {
  return (
    <div
      className={
        "rounded-[10px] hover:cursor-pointer border-[3px] w-[2rem] border-white flex items-center justify-center bg-skyblue aspect-square drop-shadow-textShadow " +
        className
      }
      onClick={onClick}
    >
      {item({ className: "w-full aspect-square" })}
    </div>
  );
};

export default GameItemButton;
