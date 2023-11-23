import Logo from "../../assets/svg/Logo";
import { motion } from "framer-motion";
const LoginLogo: React.FC = () => {
  return (
    <motion.div
      className="relative my-[4rem]"
      initial={{
        scale: 0.25,
      }}
      animate={{
        scale: 0.75,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <Logo className="relative z-10" />
      <div className="absolute top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] z-0 rotate-[30deg]">
        <div className="flex flex-row items-center">
          <div className="w-[3rem] h-[7rem] rounded-full bg-yellow"></div>
          <div className="w-[3rem] h-[12rem] rounded-full bg-[#449DC6]"></div>
          <div className="w-[3rem] h-[18rem] rounded-full bg-skyblue"></div>
          <div className="w-[3rem] h-[13rem] rounded-full bg-[#C896F6]"></div>
          <div className="w-[3rem] h-[11rem] rounded-full bg-yellow"></div>
          <div className="w-[3rem] h-[6rem] rounded-full bg-pink"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginLogo;
