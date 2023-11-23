import { engToKor, korToEng } from "korsearch";
import { GameItemType } from "./gameItemType";

export const gameItemHandler = (
  setCode: React.Dispatch<React.SetStateAction<string>>,
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
  gamePlayerCount: number,
) => {
  return (type: GameItemType) => {
    switch (type) {
      case GameItemType.SWAP:
        swapRandomLine(setCode, gamePlayerCount);
        break;
      case GameItemType.SCREENBLOCK:
        screenBlock(dispatch, gamePlayerCount);
        break;
      case GameItemType.TYPERANDOM:
        typeRandom(dispatch, gamePlayerCount);
        break;
      case GameItemType.TINYCODE:
        tinyCode(dispatch, gamePlayerCount);
        break;
      case GameItemType.CRAZYMUSIC:
        crazyMusic(gamePlayerCount);
        break;
      case GameItemType.REVERSELANGUAGE:
        reverseLanguage(setCode, dispatch, gamePlayerCount);
        break;
      case GameItemType.STOLEEYE:
        stealEye(dispatch, gamePlayerCount);
        break;
      default:
        break;
    }
  };
};

const timerID: {
  screenBlock: ReturnType<typeof setTimeout> | number;
  typeRandom: ReturnType<typeof setTimeout> | number;
  tinyCode: ReturnType<typeof setTimeout> | number;
  crazyMusic: ReturnType<typeof setTimeout> | number;
  reverseLanguage: ReturnType<typeof setTimeout> | number;
  stealEye: ReturnType<typeof setTimeout> | number;
} = {
  screenBlock: 0,
  typeRandom: 0,
  tinyCode: 0,
  crazyMusic: 0,
  reverseLanguage: 0,
  stealEye: 0,
};

const swapRandomLine = (setCode: React.Dispatch<React.SetStateAction<string>>, gamePlayerCount: number) => {
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
  gamePlayerCount: number,
) => {
  setCode(code => engToKor(code));
  dispatch({ type: GameItemType.REVERSELANGUAGE, act: "on" });
  if (timerID.reverseLanguage) {
    clearTimeout(timerID.reverseLanguage);
  }
  timerID.reverseLanguage = setTimeout(
    () => {
      setCode(code => korToEng(code));
      dispatch({ type: GameItemType.REVERSELANGUAGE, act: "off" });
      timerID.reverseLanguage = 0;
    },
    (1000 * 15) / Math.log2(gamePlayerCount),
  );
};

const tinyCode = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
  gamePlayerCount: number,
) => {
  dispatch({ type: GameItemType.TINYCODE, act: "on" });
  setTimeout(
    () => {
      dispatch({ type: GameItemType.TINYCODE, act: "off" });
    },
    (1000 * 10) / Math.log2(gamePlayerCount),
  );
};

const screenBlock = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
  gamePlayerCount: number,
) => {
  dispatch({ type: GameItemType.SCREENBLOCK, act: "on" });
  setTimeout(
    () => {
      dispatch({ type: GameItemType.SCREENBLOCK, act: "off" });
    },
    (1000 * 10) / Math.log2(gamePlayerCount),
  );
};

const typeRandom = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
  gamePlayerCount: number,
) => {
  dispatch({ type: GameItemType.TYPERANDOM, act: "on" });
  setTimeout(
    () => {
      dispatch({ type: GameItemType.TYPERANDOM, act: "off" });
    },
    (1000 * 10) / Math.log2(gamePlayerCount),
  );
};

const crazyMusic = (gamePlayerCount: number) => {
  const audioNameList = ["/music/RDD.mp3", "/music/URMan.mp3"];
  const audioIdx = Math.floor(Math.random() * audioNameList.length);
  const audio = new Audio(audioNameList[audioIdx]);
  audio.volume = 0.2;
  audio.play();
  setTimeout(
    () => {
      audio.pause();
    },
    (1000 * 20) / Math.log2(gamePlayerCount),
  );
};

const stealEye = (
  dispatch: React.Dispatch<{
    type: GameItemType;
    act: "on" | "off";
  }>,
  gamePlayerCount: number,
) => {
  dispatch({ type: GameItemType.STOLEEYE, act: "on" });
  setTimeout(
    () => {
      dispatch({ type: GameItemType.STOLEEYE, act: "off" });
    },
    (1000 * 15) / Math.log2(gamePlayerCount),
  );
};
