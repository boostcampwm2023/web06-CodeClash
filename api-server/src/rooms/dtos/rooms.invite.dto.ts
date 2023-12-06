import { IsNotEmpty, IsString } from 'class-validator';

export default class RoomsInviteDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  targetUserName: string;

  @IsString()
  @IsNotEmpty()
  targetUserRoomId: string;
}
