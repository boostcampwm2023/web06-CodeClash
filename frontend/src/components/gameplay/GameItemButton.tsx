interface GameItemButtonProps {
  item: "swap";
  onClick?: () => void;
}

const GameItemButton: React.FC<GameItemButtonProps> = ({ item, onClick }) => {
  return (
    <div
      className="rounded-[10px] hover:cursor-pointer border-[3px] border-white flex items-center justify-center bg-skyblue aspect-square drop-shadow-textShadow"
      onClick={onClick}
    >
      item
    </div>
  );
};

export default GameItemButton;
