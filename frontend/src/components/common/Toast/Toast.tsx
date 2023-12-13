import { AnimatePresence, motion } from "framer-motion";
import { ReactNode } from "react";
import { create } from "zustand";
import ToastItem from "./ToastItem";

interface ToastState {
  messageList: ReactNode[];
}

interface ToastAction {
  removeToast: (node: ReactNode) => void;
  toast: (node: ReactNode) => void;
}

interface ToastStore extends ToastState, ToastAction {}

const useToastStore = create<ToastStore>((set, get) => ({
  messageList: [],
  removeToast: node => set(state => ({ messageList: state.messageList.filter(msg => msg !== node) })),
  toast: node =>
    set(state => {
      const newMessageList = state.messageList.concat(node);
      setTimeout(() => {
        get().removeToast(node);
      }, 4000);
      return { messageList: newMessageList };
    }),
}));

export const toast = (node: ReactNode) => useToastStore.getState().toast(node);

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
