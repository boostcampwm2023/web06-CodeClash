import {
  IsBoolean,
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';

export enum ItemList {
  SWAP,
  SCREENBLOCK,
  TYPERANDOM,
  TINYCODE,
  CRAZYMUSIC,
  REVERSELANGUAGE,
  STOLEEYE,
  UNDO,
  DELAYINPUT,
}

export class RoomsUserDto {
  @IsString()
  @IsNotEmpty()
  socketId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsBoolean()
  @IsNotEmpty()
  ready: boolean;

  @IsBoolean()
  @IsNotEmpty()
  passed: boolean;

  @IsNumber()
  @IsNotEmpty()
  ranking: number;

  @IsObject()
  itemList: Record<ItemList, number>;
}
