import { baseAxios } from "./baseAxios";

export const getUserInfo = async (userName: string) => {
  try {
    const res = await baseAxios.get(`/api/users/${userName}`);

    return res.data;
  } catch (e) {
    return;
  }
};

export const getLastSubmission = async (userName: string, problemId: number, title?: string) => {
  try {
    const res = await baseAxios.get(`/api/submissions/getLastSubmission?userName=${userName}&problemId=${problemId}`);

    return { userName, problemId, title, res };
  } catch (e) {
    return;
  }
};
