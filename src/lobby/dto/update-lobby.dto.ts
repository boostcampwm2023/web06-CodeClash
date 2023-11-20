import { PartialType } from '@nestjs/mapped-types';
import { CreateLobbyDto } from './create-lobby.dto';

export class UpdateLobbyDto extends PartialType(CreateLobbyDto) {
  id: number;
}
