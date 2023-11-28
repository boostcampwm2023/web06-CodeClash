import axios, { InternalAxiosRequestConfig } from "axios";
import { useLoginStore } from "../store/useLogin";

export const refreshAccessToken = async (config: InternalAxiosRequestConfig) => {
  const { expireTime, loginAt, isLogin, setAccessToken, setLoginAt, accessToken } = useLoginStore.getState();

  if (!isLogin) return config;

  if (!config.headers.Authorization && accessToken) {
    config.headers.Authorization = "Bearer " + accessToken;
  }
  const now = new Date().getTime();
  const diff = now - loginAt;

  if (diff > expireTime) {
    const accessToken = (await axios.post("https://codeclash.site/api/auth/token/access")).data.accessToken;

    if (accessToken) {
      setAccessToken(accessToken);
      setLoginAt(now);
    }

    config.headers.Authorization = "Bearer " + accessToken;
  }

  return config;
};

export const refreshErrorHandle = () => {};
