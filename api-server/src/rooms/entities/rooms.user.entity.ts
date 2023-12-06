import { IsBoolean, IsString, IsObject, IsNotEmpty } from 'class-validator';
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

  @IsObject()
  itemList: Record<string, ItemList>;
}
