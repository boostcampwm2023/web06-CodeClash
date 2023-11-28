import { baseAxios } from "./baseAxios";

export const getProblemById = async (id: number) => {
  try {
    const res = await baseAxios.get(`/api/problems?problemId=${id}`);
    return res;
  } catch (err: any) {
    alert(err);
  }
};

export const postProblemGrade = async (id: number, code: string) => {
  try {
    const res = await baseAxios.post(`/api/scores/grade`, {
      code,
      language: "javascript",
      problemId: id,
    });
    return res;
  } catch (err: any) {
    alert(err);
  }
};
