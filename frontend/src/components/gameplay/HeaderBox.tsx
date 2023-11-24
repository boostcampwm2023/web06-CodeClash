interface GameHeaderBoxProps {
  title: string;
}

const GameHeaderBox: React.FC<GameHeaderBoxProps> = ({ title }) => {
  return (
    <header className="absolute top-0 left-0">
      <div className="absolute h-full w-full bg-pink rounded-br-sm skew-x-left -right-2 z-0"></div>
      <div className="relative bg-pink px-4 py-[0.2em] flex flex-row text-[24px] gap-12 z-10 text-white">
        <p className="drop-shadow-textShadow mr-4">{title}</p>
      </div>
    </header>
  );
};

export default GameHeaderBox;
