import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

interface LoginState {
  email: string;
  nickname: string;
  isLogin: boolean;
  accessToken?: string;
}

interface LoginAction {
  setEmail: (email: string) => void;
  setIsLogin: (isLoggined: boolean) => void;
  setNickname: (nickname: string) => void;
  setInitialize: () => void;
  setAccessToken: (accessToken: string) => void;
  setLogin: (email: string, nickname: string, accessToken: string) => void;
}

export interface LoginStore extends LoginState, LoginAction {}

export type LoginStatePersist = (
  config: StateCreator<LoginStore>,
  options: PersistOptions<LoginState>,
) => StateCreator<LoginStore>;

export const useLoginStore = create<LoginStore>(
  (persist as LoginStatePersist)(
    set => ({
      email: "",
      isLogin: false,
      nickname: "",
      accessToken: "",
      setEmail: email => set(state => ({ email: email })),
      setNickname: nickname => set(state => ({ nickname: nickname })),
      setIsLogin: isLogin => set(state => ({ isLogin: isLogin })),
      setInitialize: () =>
        set(state => ({
          email: "",
          nickname: "",
          isLogin: false,
          accessToken: "",
        })),
      setAccessToken: accessToken => set(state => ({ accessToken: accessToken })),
      setLogin: (email, nickname, accessToken) =>
        set(state => ({
          email: email,
          nickname: nickname,
          isLogin: true,
          accessToken: accessToken,
        })),
    }),
    { name: "loginStore" },
  ),
);
