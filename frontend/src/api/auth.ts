import axios from "axios";

export const postLoginRequest = (email: string, password: string) => {
  const authAxios = axios.create({
    baseURL: "https://codeclash.site",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      WithCredentials: "true",
      authorization: "Basic " + btoa(email + ":" + password),
    },
  });

  return authAxios.post("/auth/login/email", {
    email,
    password,
  });
};

export const postRegisterRequest = (name: string, email: string, password: string) => {
  const authAxios = axios.create({
    baseURL: "https://codeclash.site",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      WithCredentials: "true",
    },
  });

  return authAxios.post("/auth/register/email", {
    name,
    email,
    password,
  });
};
