import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { LobbyService } from './lobby.service';
import { CreateLobbyDto } from './dto/create-lobby.dto';
import { UpdateLobbyDto } from './dto/update-lobby.dto';

@WebSocketGateway()
export class LobbyGateway {
  constructor(private readonly lobbyService: LobbyService) {}

  @SubscribeMessage('createLobby')
  create(@MessageBody() createLobbyDto: CreateLobbyDto) {
    return this.lobbyService.create(createLobbyDto);
  }

  @SubscribeMessage('findAllLobby')
  findAll() {
    return this.lobbyService.findAll();
  }

  @SubscribeMessage('findOneLobby')
  findOne(@MessageBody() id: number) {
    return this.lobbyService.findOne(id);
  }

  @SubscribeMessage('updateLobby')
  update(@MessageBody() updateLobbyDto: UpdateLobbyDto) {
    return this.lobbyService.update(updateLobbyDto.id, updateLobbyDto);
  }

  @SubscribeMessage('removeLobby')
  remove(@MessageBody() id: number) {
    return this.lobbyService.remove(id);
  }
}
