export interface IGameItem {
  type: GameItemType;
  name: string;
  description: string;
}

export enum GameItemType {
  SWAP,
  SCREENBLOCK,
  TYPEBLOCK,
  TINYCODE,
  CRAZYMUSIC,
  REVERSELANGUAGE,
  STOLEEYE,
}

export const gameItemTypes: IGameItem[] = [
  {
    type: GameItemType.SWAP,
    name: "스왑",
    description: "랜덤한 두 줄의 코드를 바꿉니다.",
  },
  {
    type: GameItemType.SCREENBLOCK,
    name: "화면가리기",
    description: "상대방의 화면을 8초간 깜빡입니다.",
  },
  {
    type: GameItemType.TYPEBLOCK,
    name: "타이핑방해",
    description: "상대방의 타이핑을 5초간 막습니다.",
  },
  {
    type: GameItemType.TINYCODE,
    name: "작은코드",
    description: "상대방의 코드를 작게 만듭니다.",
  },
  {
    type: GameItemType.CRAZYMUSIC,
    name: "크레이지뮤직",
    description: "중독성이 강한 음악을 틀어줍니다.",
  },
  {
    type: GameItemType.REVERSELANGUAGE,
    name: "언어 뒤집기",
    description: "상대방의 코드 언어를 한영을 바꿉니다",
  },
  {
    type: GameItemType.STOLEEYE,
    name: "시선강탈",
    description: "시선강탈 움짤을 틀어줍니다.",
  },
];
