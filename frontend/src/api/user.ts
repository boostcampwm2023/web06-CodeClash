import { baseAxios } from "./baseAxios";

export const getUserInfo = async (userName: string, page: number = 0, limit: number = 5) => {
  try {
    const res = await baseAxios.get(`/api/users/${userName}`, {
      params: {
        page,
        limit,
      },
    });

    return res.data;
  } catch (e) {
    return;
  }
};

export const getUserStat = async (userName: string) => {
  try {
    const res = await baseAxios.get(`/api/users/stats/${userName}`);

    return res.data;
  } catch (e) {
    return;
  }
};
