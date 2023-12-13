import { ReactNode } from "react";
import { create } from "zustand";

interface ToastState {
  messageList: ReactNode[];
}

interface ToastAction {
  removeToast: (node: ReactNode) => void;
  toast: (node: ReactNode) => void;
}

interface ToastStore extends ToastState, ToastAction {}

export const useToastStore = create<ToastStore>((set, get) => ({
  messageList: [],
  removeToast: node => set(state => ({ messageList: state.messageList.filter(msg => msg !== node) })),
  toast: node =>
    set(state => {
      const newMessageList = state.messageList.concat(node);
      setTimeout(() => {
        get().removeToast(node);
      }, 3000);
      return { messageList: newMessageList };
    }),
}));
