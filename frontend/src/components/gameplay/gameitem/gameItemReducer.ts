import { GameItemType } from "./gameItemType";

interface IGameItemState {
  isScreenBlock: boolean;
  isTypeRandom: boolean;
  isTinyCode: boolean;
  isCrazyMusic: boolean;
  isReverseLanguage: boolean;
  isEyeStolen: boolean;
  undo: number;
  isInputDelay: boolean;
  fontSize: number;
}

export const initialGameItemState: IGameItemState = {
  isScreenBlock: false,
  isTypeRandom: false,
  isTinyCode: false,
  isCrazyMusic: false,
  isReverseLanguage: false,
  isEyeStolen: false,
  undo: 0,
  isInputDelay: false,
  fontSize: 16,
};

export const gameItemReducer = (
  state: IGameItemState,
  action: {
    type: GameItemType;
    act: "on" | "off";
  },
): IGameItemState => {
  switch (action.type) {
    case GameItemType.SCREENBLOCK:
      return {
        ...state,
        isScreenBlock: action.act === "on",
      };
    case GameItemType.TYPERANDOM:
      return {
        ...state,
        isTypeRandom: action.act === "on",
      };
    case GameItemType.TINYCODE:
      return {
        ...state,
        isTinyCode: action.act === "on",
        fontSize: action.act === "on" ? 8 : 16,
      };
    case GameItemType.CRAZYMUSIC:
      return {
        ...state,
        isCrazyMusic: action.act === "on",
      };
    case GameItemType.REVERSELANGUAGE:
      return {
        ...state,
        isReverseLanguage: action.act === "on",
      };
    case GameItemType.STOLEEYE:
      return {
        ...state,
        isEyeStolen: action.act === "on",
      };
    case GameItemType.UNDO:
      return {
        ...state,
        undo: action.act === "on" ? state.undo + 1 : state.undo,
      };
    case GameItemType.DELAYINPUT:
      return {
        ...state,
        isInputDelay: action.act === "on",
      };
    default:
      return state;
  }
};
