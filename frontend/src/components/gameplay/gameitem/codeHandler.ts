import { engToKor, korToEng } from "korsearch";
import { GameItemType } from "./gameItemType";

export const swapRandomLine = (setCode: React.Dispatch<React.SetStateAction<string>>) => {
  setCode(code => {
    const codeLine = code.split("\n");
    const wholeLineCount = codeLine.length;
    const [firstLine, secondLine] = Array(wholeLineCount)
      .fill(0)
      .reduce((acc, _, idx) => {
        if (codeLine[idx].trim() === "") return acc;
        return acc.concat(idx);
      }, [])
      .sort(() => Math.random() - 0.5);
    const temp = codeLine[firstLine];
    codeLine[firstLine] = codeLine[secondLine];
    codeLine[secondLine] = temp;
    return codeLine.join("\n");
  });
};

export const reverseLanguage = (
  setCode: React.Dispatch<React.SetStateAction<string>>,
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
) => {
  setCode(code => engToKor(code));
  dispatch({ type: GameItemType.REVERSELANGUAGE, act: "on" });
  setTimeout(() => {
    setCode(code => korToEng(code));
    dispatch({ type: GameItemType.REVERSELANGUAGE, act: "off" });
  }, 1000 * 12);
};
