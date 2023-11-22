import { GameItemType } from "./gameItemType";

interface IGameItemState {
  isScreenBlock: boolean;
  isTypeBlock: boolean;
  isTinyCode: boolean;
  isCrazyMusic: boolean;
  isReverseLanguage: boolean;
  fontSize: number;
}

export const initialGameItemState = {
  isScreenBlock: false,
  isTypeBlock: false,
  isTinyCode: false,
  isCrazyMusic: false,
  isReverseLanguage: false,
  fontSize: 16,
};

export const gameItemReducer = (
  state: IGameItemState,
  action: {
    type: GameItemType;
    act: "on" | "off";
  },
) => {
  switch (action.type) {
    case GameItemType.SCREENBLOCK:
      return {
        ...state,
        isScreenBlock: action.act === "on",
      };
    case GameItemType.TYPEBLOCK:
      return {
        ...state,
        isTypeBlock: action.act === "on",
      };
    case GameItemType.TINYCODE:
      return {
        ...state,
        isTinyCode: action.act === "on",
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
    default:
      return state;
  }
};
