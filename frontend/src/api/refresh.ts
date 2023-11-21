import { InternalAxiosRequestConfig } from "axios";
import { useLoginStore } from "../store/useLogin";
import { baseAxios } from "./baseAxios";

export const refreshAccessToken = async (config: InternalAxiosRequestConfig) => {
  const { expireTime, loginAt, isLogin, setAccessToken, setLoginAt } = useLoginStore.getState();

  if (!isLogin) return config;
  const now = new Date().getTime();
  const diff = now - loginAt;

  if (diff > expireTime) {
    const accessToken = (await baseAxios.get("/token/access")).data.accessToken;

    if (accessToken) {
      setAccessToken(accessToken);
      setLoginAt(now);
    }

    config.headers.Authorization = "Bearer " + accessToken;
  }

  return config;
};

export const refreshErrorHandle = () => {};
