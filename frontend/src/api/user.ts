import { baseAxios } from "./baseAxios";

export const getUserInfo = async (userName: string) => {
  try {
    const res = await baseAxios.get(`/api/users/${userName}`);

    return res.data;
  } catch (e) {
    return;
  }
};
