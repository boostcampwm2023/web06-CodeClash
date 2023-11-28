import { motion } from "framer-motion";

const ScreenBlock: React.FC = () => {
  return (
    <motion.div
      animate={{ opacity: [0, 1, 0] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      className="absolute z-50 w-full h-full top-0 left-0 bg-black pointer-events-none"
    ></motion.div>
  );
};

export default ScreenBlock;
