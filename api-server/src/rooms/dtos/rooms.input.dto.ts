import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RoomsInputDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  roomId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userName?: string;
}
