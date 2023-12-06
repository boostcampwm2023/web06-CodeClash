export const getPercentage = (nume: number, deno: number) => {
  if (deno === 0) return 0;
  return Math.floor((nume / deno) * 100);
};
