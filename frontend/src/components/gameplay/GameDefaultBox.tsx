interface GameDefaultBoxProps {
  children: React.ReactNode;
}

const GameDefaultBox: React.FC<GameDefaultBoxProps> = ({ children }) => {
  return <div className="">{children}</div>;
};

export default GameDefaultBox;
