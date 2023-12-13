import { useToastStore } from "../../store/useToast";
import { AnimatePresence, motion } from "framer-motion";

interface ToastItemProps {
  children: React.ReactNode;
}

const ToastItem: React.FC<ToastItemProps> = ({ children }) => {
  return (
    <motion.div
      layout
      layoutId={children?.toString()}
      initial={{
        x: "150%",
      }}
      animate={{
        x: "0%",
      }}
      exit={{
        x: "150%",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className="relative z-50 w-fit"
    >
      <div className="absolute w-[200%] h-full bg-pink rounded-sm skew-x-right z-10 border-[3px] border-b-0 "></div>
      <div className="absolute w-[200%] h-full bg-black rounded-sm skew-x-right z-0 border-[3px] -bottom-1.5 left-0.5"></div>

      <p className="relative drop-shadow-textShadow  text-white px-2 py-1 z-20">{children}</p>
    </motion.div>
  );
};

const Toast: React.FC = () => {
  const { messageList } = useToastStore();

  return (
    <div className="absolute top-2 right-2 z-50 flex flex-col gap-4">
      <AnimatePresence initial={false}>
        {messageList.map((node, idx) => {
          return <ToastItem key={node?.toString()}>{node}</ToastItem>;
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
