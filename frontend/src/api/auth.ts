import axios from "axios";
import { baseAxios } from "./baseAxios";

export const postLoginRequest = (email: string, password: string) => {
  return baseAxios({
    method: "post",
    url: "/auth/login/email",
    headers: {
      Authorization: "Basic " + btoa(email + ":" + password),
    },
  });
};

export const postRegisterRequest = async (name: string, email: string, password: string) => {
  const res = await baseAxios.post("/auth/register/email", {
    name,
    email,
    password,
  });

  if (res.status) {
    return res.data;
  }
  throw new Error("error");
};
