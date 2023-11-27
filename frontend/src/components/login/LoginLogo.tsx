import Logo from "../../assets/svg/Logo";
import { motion } from "framer-motion";
const LoginLogo: React.FC = () => {
  return (
    <motion.div
      className="relative my-[5vh]"
      initial={{
        scale: 0.25,
      }}
      animate={{
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
    >
      <Logo className="relative z-10 w-[35vh]" />
      <div className="absolute z-0 top-[50%] -translate-y-[50%] left-[50%] -translate-x-[50%] rotate-[30deg] scale-75">
        <div className="flex flex-row items-center">
          <div className="w-[9vh] h-[21vh] rounded-full bg-yellow"></div>
          <div className="w-[9vh] h-[36vh] rounded-full bg-[#449DC6]"></div>
          <div className="w-[9vh] h-[54vh] rounded-full bg-skyblue"></div>
          <div className="w-[9vh] h-[39vh] rounded-full bg-[#C896F6]"></div>
          <div className="w-[9vh] h-[33vh] rounded-full bg-yellow"></div>
          <div className="w-[9vh] h-[18vh] rounded-full bg-pink"></div>
        </div>
      </div>
    </motion.div>
  );
};

export default LoginLogo;
