import axios from "axios";
import { baseAxios } from "./baseAxios";

export const postLoginRequest = (email: string, password: string) => {
  return baseAxios({
    method: "post",
    url: "/auth/login/email",
    headers: {
      authorization: "Basic " + btoa(email + ":" + password),
    },
    data: {
      email,
      password,
    },
  });
};

export const postRegisterRequest = (name: string, email: string, password: string) => {
  return baseAxios.post("/auth/register/email", {
    name,
    email,
    password,
  });
};
