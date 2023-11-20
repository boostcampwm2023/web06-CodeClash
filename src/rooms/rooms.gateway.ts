import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { SocketBearerTokenGuard } from 'src/auth/guard/socket/socket-bearer-token.guard';
import { UserTable } from 'src/users/entities/user.entity';

@WebSocketGateway({
  namespace: 'rooms',
  cors: true,
})
export class RoomsGateway {
  constructor(private readonly roomsService: RoomsService) {}

  @WebSocketServer()
  server: Server;

  @UseGuards(SocketBearerTokenGuard)
  handleConnection(@ConnectedSocket() socket: Socket & { user: UserTable }) {
    console.log(`${socket.user.name} is connected. joining lobby`);

    this.roomsService.enterRoom(socket, 'lobby');

    this.server.in('lobby').emit('lobby_connect', {
      userName: socket.user.name,
      message: `${socket.user.name} is connected to lobby`,
      clientList: this.roomsService.getAllClient('lobby'),
      gameRoomList: this.roomsService.getAllGameRoom(),
    });
  }

  @UseGuards(SocketBearerTokenGuard)
  @SubscribeMessage('create_room')
  createRoom(
    @ConnectedSocket() client: Socket & { user: UserTable },
    @MessageBody() data,
  ) {
    const { capacity, roomName } = data;

    this.roomsService.createRoom(client, roomName, capacity);
    client.emit('create_room', {
      userName: client.user.name,
      message: `${client.user.name} 님이 ${roomName}방을 생성했습니다.`,
    });
  }

  @UseGuards(SocketBearerTokenGuard)
  @SubscribeMessage('enter_room')
  enterRoom(
    @ConnectedSocket() client: Socket & { user: UserTable },
    @MessageBody() data,
  ) {
    const { roomId } = data;

    const roomInfo = this.roomsService.getGameRoom(roomId);
    if (roomInfo.userList.length >= roomInfo.capacity) {
      client.emit('enter_room', {
        status: 'fail',
        message: '방이 꽉 찼습니다.',
      });
      return;
    }

    this.roomsService.enterRoom(client, roomId);
    client.emit('enter_room', {
      status: 'success',
      message: '방에 입장했습니다.',
      userList: this.roomsService.getAllClient(roomId),
    });

    client.to(roomId).emit('user_join', {
      userName: client.user.name,
      message: `${client.user.name} 님이 ${
        this.roomsService.getGameRoom(roomId).roomName
      } 방에 접속했습니다.`,
    });
  }

  @SubscribeMessage('exit_room')
  exitRoom(
    @ConnectedSocket() client: Socket & { user: UserTable },
    @MessageBody() data,
  ) {
    const { roomId } = data;

    this.roomsService.exitRoom(client, roomId);
    client.to(roomId).emit('exit_room', {
      userName: client.user.name,
      message: `${client.user.name} 님이 ${
        this.roomsService.getGameRoom(roomId).roomName
      } 방에서 나갔습니다.`,
    });
  }

  @SubscribeMessage('exit_lobby')
  exitLobby(@ConnectedSocket() client: Socket & { user: UserTable }) {
    this.roomsService.exitLobby(client);
  }

  @SubscribeMessage('chat')
  chat(
    @ConnectedSocket() client: Socket & { user: UserTable },
    @MessageBody() data,
  ) {
    const { roomId, message } = data;

    client.to(roomId).emit('chat', {
      userName: client.user.name,
      message,
    });
  }
}
