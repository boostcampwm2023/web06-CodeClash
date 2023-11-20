import axios from "axios";

const url = true ? "https://codeclash.site" : "http://localhost:3000";

// 추후 수정

export const baseAxios = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json; charset=UTF-8",
    WithCredentials: "true",
    authorization: "Bearer " + localStorage.getItem("accessToken"),
  },
});
