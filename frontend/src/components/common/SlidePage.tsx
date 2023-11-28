import { motion } from "framer-motion";

interface SlidePageProps {
  children: React.ReactNode;
  className?: string;
}

const SlidePage: React.FC<SlidePageProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{
        x: "100%",
      }}
      animate={{
        x: 0,
      }}
      exit={{
        x: "-100%",
      }}
      transition={{
        duration: 0.5,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlidePage;
