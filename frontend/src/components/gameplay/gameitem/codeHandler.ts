import { engToKor, korToEng } from "korsearch";
import { GameItemType } from "./gameItemType";

const swapRandomLine = (setCode: React.Dispatch<React.SetStateAction<string>>) => {
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
    [codeLine[firstLine], codeLine[secondLine]] = [codeLine[secondLine], codeLine[firstLine]];
    return codeLine.join("\n");
  });
};

const reverseLanguage = (
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

const tinyCode = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
) => {
  dispatch({ type: GameItemType.TINYCODE, act: "on" });
  setTimeout(() => {
    dispatch({ type: GameItemType.TINYCODE, act: "off" });
  }, 1000 * 10);
};

const screenBlock = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
) => {
  dispatch({ type: GameItemType.SCREENBLOCK, act: "on" });
  setTimeout(() => {
    dispatch({ type: GameItemType.SCREENBLOCK, act: "off" });
  }, 1000 * 8);
};

const typeBlock = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
) => {
  dispatch({ type: GameItemType.TYPEBLOCK, act: "on" });
  setTimeout(() => {
    dispatch({ type: GameItemType.TYPEBLOCK, act: "off" });
  }, 1000 * 5);
};
