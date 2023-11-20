import { create } from "zustand";

interface LoginState {
  isLogin: boolean;
  accessToken?: string;
  setIsLogin: (isLogin: boolean) => void;
  setAccessToken: (accessToken: string) => void;
}

export const useLogin = create<LoginState>(set => ({
  isLogin: false,
  accessToken: localStorage.getItem("accessToken") ?? undefined,
  setIsLogin: (isLogin: boolean) => set({ isLogin }),
  setAccessToken: (accessToken: string) => set({ accessToken }),
}));
