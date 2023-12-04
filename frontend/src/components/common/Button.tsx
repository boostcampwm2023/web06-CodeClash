interface ButtonProps {
  color: "skyblue" | "pink" | "yellow" | "black";
  title: string;
  subTitle?: string;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ color, title, subTitle = "", onClick, className = "" }) => {
  const colorVariants = {
    skyblue: "bg-skyblue",
    pink: "bg-pink",
    yellow: "bg-yellow",
    black: "bg-black",
  };
  return (
    <div
      className={
        "px-4 py-3 text-white text-center font-bold rounded-md hover:cursor-pointer border-8 border-white flex flex-col items-center justify-center select-none " +
        colorVariants[color] +
        " " +
        className
      }
      onClick={onClick}
    >
      <p className="drop-shadow-textShadow h-4 flex items-center justify-center">{title}</p>
      {subTitle && <p className="text-[0.5em] drop-shadow-textShadow h-2 leading-[1em]">{subTitle}</p>}
    </div>
  );
};

export default Button;
