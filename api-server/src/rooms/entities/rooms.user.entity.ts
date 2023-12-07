import {
  IsBoolean,
  IsString,
  IsObject,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';
import { ItemList } from '../dtos/rooms.user.dto';

export class RoomsUser {
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
  itemList: Record<string, ItemList>;
}
