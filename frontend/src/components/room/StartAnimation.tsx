import { Variants, motion } from "framer-motion";
import starteffectimage from "../../assets/img/starteffectimage.png";

const itemVariants: Variants = {
  open: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
  closed: { opacity: 0, transition: { duration: 0.2 }, scale: 0.3 },
};

const leftVariants: Variants = {
  open: {
    ...itemVariants.open,
    x: 0,
    rotate: -3,
  },
  closed: {
    rotate: -3,
    ...itemVariants.closed,
    x: "-100vw",
  },
};

const rightVariants: Variants = {
  open: {
    ...itemVariants.open,
    x: 0,
    rotate: -3,
  },
  closed: {
    rotate: -3,
    ...itemVariants.closed,
    x: "100vw",
  },
};

const containerVariants: Variants = {
  open: {
    transition: {
      type: "spring",
      bounce: 0,
      staggerChildren: 0.2,
    },
  },
  closed: {
    transition: {
      type: "spring",
      bounce: 0,
      duration: 0.3,
    },
  },
};

interface StartAnimationProps {
  isStart: boolean;
}

const StartAnimation: React.FC<StartAnimationProps> = ({ isStart }) => {
  return (
    <motion.nav
      initial={false}
      animate={isStart ? "open" : "closed"}
      className="absolute z-50 w-full flex items-center justify-center"
      variants={containerVariants}
      style={{ pointerEvents: isStart ? "auto" : "none" }}
    >
      <motion.div className="relative z-10" variants={itemVariants}>
        <div className="relative z-50 w-[200vw] h-[6rem] bg-barPattern bg-center shadow-inner -rotate-3 border-b-pink border-b-[0.5vh] flex items-center justify-center">
          <p className="relative top-[0.2rem] text-[4rem] text-white drop-shadow-textBlack border-pink font-outline-2">
            전투 시작!
          </p>
        </div>
        <div className="absolute w-[200vw] h-[6.4rem] top-[-0.2rem] bg-white shadow-inner -rotate-3 border-b-[0.25rem] z-0"></div>
      </motion.div>
      <motion.div
        className="absolute z-20 -rotate-3 bg-pink rounded-full w-[40vw] h-[3rem] left-[-20vw] top-0"
        variants={leftVariants}
      ></motion.div>
      <motion.div
        className="absolute z-20 -rotate-3 bg-black rounded-full w-[30vw] h-[2rem] left-[-15vw] top-[2rem]"
        variants={leftVariants}
      ></motion.div>
      <motion.div
        className="absolute z-20 -rotate-3 bg-pink rounded-full w-[24vw] h-[2.5rem] right-[-12vw] bottom-[0.2rem]"
        variants={rightVariants}
      ></motion.div>
      <motion.div
        className="absolute z-20 -rotate-3 bg-white rounded-full w-[12vw] h-[1.5rem] right-[-6vw] bottom-[-0.5rem]"
        variants={rightVariants}
      ></motion.div>
    </motion.nav>
  );
};

export default StartAnimation;
