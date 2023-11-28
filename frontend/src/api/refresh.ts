import axios, { AxiosResponse } from "axios";
import { baseURL } from "./baseAxios";
import { useLoginStore } from "../store/useLogin";

export const onResponse = async (response: AxiosResponse) => {
  return response;
};

export const onFailed = async (error: any) => {
  const { config, response } = error;
  const { setAccessToken } = useLoginStore.getState();
  if (response?.status === 401) {
    const originalRequest = config;
    const res = await axios.get(`${baseURL}/api/auth/token/access`, { withCredentials: true });
    setAccessToken(res.data.accessToken);
    return axios({
      ...originalRequest,
      headers: {
        Authorization: "Bearer " + res.data.accessToken,
      },
      withCredentials: true,
    });
  }
  return Promise.reject(error);
};
