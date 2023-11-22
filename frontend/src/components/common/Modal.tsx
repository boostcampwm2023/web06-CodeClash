import { createPortal } from "react-dom";
import Button from "./Button";
import { motion } from "framer-motion";
interface ModalProps {
  title: string;
  closeModal: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ title, closeModal, children, className = "" }) => {
  return createPortal(
    <div className="absolute top-0 flex justify-center items-center w-screen h-screen bg-black/50" onClick={closeModal}>
      <motion.div
        initial={{
          scale: 0.25,
        }}
        animate={{
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 20,
        }}
        className="relative flex flex-col items-center text-white bg-skyblue p-2 rounded-xl border-8 border-white"
        onClick={e => e.stopPropagation()}
      >
        <div>{title}</div>
        <div className="border-4 rounded-lg w-full border-white"></div>
        <div className={"my-2 " + className}>{children}</div>
        <Button
          className="absolute bottom-[-40px] py-[10px] border-yellow"
          color="skyblue"
          title="닫기"
          onClick={closeModal}
        />
      </motion.div>
    </div>,
    document.body,
  );
};

export default Modal;
