import axios from "axios";
import { useLoginStore } from "../store/useLogin";

export const baseAxios = axios.create({
  baseURL: process.env.NODE_ENV === "development" ? "https://codeclash.site" : "http://localhost:3000",
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    WithCredentials: "true",
    authorization: "Bearer " + useLoginStore.getState().accessToken,
  },
});
