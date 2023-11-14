interface ButtonProps {
  color: "skyblue" | "pink" | "yellow";
  title: string;
  subTitle?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ color, title, subTitle = "", onClick }) => {
  const colorVariants = {
    skyblue: "bg-skyblue",
    pink: "bg-pink",
    yellow: "bg-yellow",
  };
  return (
    <div
      className={
        "px-4 py-3 w-fit text-white text-center font-bold text-xl rounded-xl hover:cursor-pointer border-8 border-white" +
        " " +
        colorVariants[color]
      }
      onClick={onClick}
    >
      <p className="drop-shadow-textShadow">{title}</p>
      {subTitle && <p className="text-[0.5rem] drop-shadow-textShadow h-[0.5rem] leading-[0.6rem]">{subTitle}</p>}
    </div>
  );
};

export default Button;
