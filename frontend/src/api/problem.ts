import { baseAxios } from "./baseAxios";

export const getProblemById = async (id: number) => {
  try {
    const res = await baseAxios.get(`/api/problems?problemId=${id}`);
    return res;
  } catch (err: any) {
    alert(err);
  }
};
