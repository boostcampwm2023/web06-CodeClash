import LoginInputBox from "../components/login/InputBox";
import LoginLogo from "../components/login/LoginLogo";
import { motion } from "framer-motion";
const LoginPage: React.FC = () => {
  return (
    <motion.div
      className="w-full h-full flex flex-col items-center justify-center gap-4"
      animate={{
        x: 0,
      }}
      exit={{
        x: "100%",
      }}
      transition={{
        duration: 0.2,
      }}
    >
      <LoginLogo />
      <LoginInputBox />
    </motion.div>
  );
};

export default LoginPage;
