import axios from "axios";
import { useLoginStore } from "../store/useLogin";
import { refreshAccessToken, refreshErrorHandle } from "./refresh";

export const baseAxios = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "https://codeclash.site" : "http://localhost:3000",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    WithCredentials: "true",
    Authorization: "Bearer " + useLoginStore.getState().accessToken,
  },
});

baseAxios.interceptors.request.use(refreshAccessToken, refreshErrorHandle);
