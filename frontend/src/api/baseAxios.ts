import axios from "axios";
import { useLoginStore } from "../store/useLogin";
import { admitAccessToken, onFailed, onResponse } from "./refresh";

export const baseURL = process.env.REACT_APP_API_URL;
export const baseAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    Authorization: "Bearer " + useLoginStore.getState().accessToken,
  },
  withCredentials: true,
});

export const gifAxios = axios.create({
  baseURL: "https://api.giphy.com/v1/gifs/",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
  },
});

baseAxios.interceptors.response.use(onResponse, onFailed);
baseAxios.interceptors.request.use(admitAccessToken);
