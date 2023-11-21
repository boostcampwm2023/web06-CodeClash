import axios from "axios";
import { useLoginStore } from "../store/useLogin";

export const baseURL = process.env.NODE_ENV === "development" ? "https://codeclash.site" : "http://localhost:3000";

export const baseAxios = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    WithCredentials: "true",
    Authorization: "Bearer " + useLoginStore.getState().accessToken,
  },
});
