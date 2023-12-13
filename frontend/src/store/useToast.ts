import { create } from "zustand";

interface ToastState {
  messageList: string[];
}

interface ToastAction {
  removeToast: (message: string) => void;
  toast: (message: string) => void;
}

interface ToastStore extends ToastState, ToastAction {}

export const useToastStore = create<ToastStore>((set, get) => ({
  messageList: [],
  removeToast: message => set(state => ({ messageList: state.messageList.filter(msg => msg !== message) })),
  toast: message =>
    set(state => {
      const newMessageList = state.messageList.concat(message);
      setTimeout(() => {
        get().removeToast(message);
      }, 3000);
      return { messageList: newMessageList };
    }),
}));
