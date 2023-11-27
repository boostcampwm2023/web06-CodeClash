import { StateCreator, create } from "zustand";
import { PersistOptions, persist } from "zustand/middleware";

const day = 24 * 60 * 60 * 1000;

interface LoginState {
  email: string;
  nickname: string;
  isLogin: boolean;
  accessToken?: string;
  loginAt: number;
  expireTime: number;
}

interface LoginAction {
  setEmail: (email: string) => void;
  setIsLogin: (isLoggined: boolean) => void;
  setNickname: (nickname: string) => void;
  setLogout: () => void;
  setAccessToken: (accessToken: string) => void;
  setLoginInitial: (email: string, nickname: string, accessToken: string) => void;
  setLoginAt: (loginAt: number) => void;
  setExpireTime: (expireAt: number) => void;
}

interface LoginStore extends LoginState, LoginAction {}

type LoginStatePersist = (
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
      loginAt: 0,
      expireTime: day, // 1day
      setEmail: email => set(state => ({ email: email })),
      setNickname: nickname => set(state => ({ nickname: nickname })),
      setIsLogin: isLogin => set(state => ({ isLogin: isLogin })),
      setLogout: () =>
        set(state => ({
          email: "",
          nickname: "",
          isLogin: false,
          accessToken: "",
        })),
      setAccessToken: accessToken => set(state => ({ accessToken: accessToken })),
      setLoginInitial: (email, nickname, accessToken) =>
        set(state => ({
          email: email,
          nickname: nickname,
          isLogin: true,
          accessToken: accessToken,
          loginAt: new Date().getTime(),
        })),
      setLoginAt: loginAt => set(state => ({ loginAt: loginAt })),
      setExpireTime: expireAt => set(state => ({ expireTime: expireAt })),
    }),
    { name: "loginStore" },
  ),
);
