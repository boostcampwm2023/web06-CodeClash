import { IsNotEmpty, IsString } from 'class-validator';

export default class RoomsInviteDto {
  @IsString()
  @IsNotEmpty()
  roomId: string;

  @IsString()
  targetUserRoomId: string;

  @IsString()
  @IsNotEmpty()
  userName: string;
}
