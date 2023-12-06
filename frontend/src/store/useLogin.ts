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
  acceptCount: number;
  failCount: number;
  winCount: number;
  totalCount: number;
}

interface LoginAction {
  setEmail: (email: string) => void;
  setIsLogin: (isLoggined: boolean) => void;
  setUserName: (userName: string) => void;
  setLogout: () => void;
  setAccessToken: (accessToken: string) => void;
  setLoginInitial: (
    email: string,
    userName: string,
    accessToken: string,
    acceptCount: number,
    failCount: number,
    winCount: number,
    totalCount: number,
  ) => void;
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
      acceptCount: 0,
      failCount: 0,
      winCount: 0,
      totalCount: 0,
      setEmail: email => set(state => ({ email })),
      setUserName: userName => set(state => ({ userName })),
      setIsLogin: isLogin => set(state => ({ isLogin })),
      setLogout: () =>
        set(state => ({
          email: "",
          userName: "",
          isLogin: false,
          accessToken: "",
          acceptCount: 0,
          failCount: 0,
          winCount: 0,
          totalCount: 0,
        })),
      setAccessToken: accessToken => set(state => ({ accessToken })),
      setLoginInitial: (email, userName, accessToken, acceptCount, failCount, winCount, totalCount) =>
        set(state => ({
          email,
          userName,
          isLogin: true,
          accessToken,
          loginAt: new Date().getTime(),
          acceptCount,
          failCount,
          winCount,
          totalCount,
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
