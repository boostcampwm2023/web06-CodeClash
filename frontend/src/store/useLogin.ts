import { StateCreator, create } from "zustand";
import { PersistOptions, createJSONStorage, persist } from "zustand/middleware";

const day = 24 * 60 * 60 * 1000;

interface LoginState {
  email: string;
  userName: string;
  isLogin: boolean;
  accessToken?: string;
  loginAt: number;
  expireTime: number;
}

interface LoginAction {
  setEmail: (email: string) => void;
  setIsLogin: (isLoggined: boolean) => void;
  setUserName: (userName: string) => void;
  setLogout: () => void;
  setAccessToken: (accessToken: string) => void;
  setLoginInitial: (email: string, userName: string, accessToken: string) => void;
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
      userName: "",
      accessToken: "",
      loginAt: 0,
      expireTime: day, // 1day
      setEmail: email => set(state => ({ email })),
      setUserName: userName => set(state => ({ userName })),
      setIsLogin: isLogin => set(state => ({ isLogin })),
      setLogout: () =>
        set(state => ({
          email: "",
          userName: "",
          isLogin: false,
          accessToken: "",
        })),
      setAccessToken: accessToken => set(state => ({ accessToken })),
      setLoginInitial: (email, userName, accessToken) =>
        set(state => ({
          email,
          userName,
          isLogin: true,
          accessToken,
          loginAt: new Date().getTime(),
        })),
      setLoginAt: loginAt => set(state => ({ loginAt })),
      setExpireTime: expireAt => set(state => ({ expireTime: expireAt })),
    }),
    {
      name: "loginstorage", // unique name
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
