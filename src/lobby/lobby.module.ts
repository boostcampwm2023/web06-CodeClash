import { Module } from '@nestjs/common';
import { LobbyService } from './lobby.service';
import { LobbyGateway } from './lobby.gateway';

@Module({
  providers: [LobbyGateway, LobbyService],
})
export class LobbyModule {}
