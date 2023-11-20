import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  WsException,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';
import { HttpToSocketExceptionFilter } from 'src/common/exception-filter/http-to-ws.exception';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  namespace: 'rooms',
  cors: true,
})
export class RoomsGateway {
  constructor(
    private readonly roomsService: RoomsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(socket: Socket) {
    try {
      const rawToken = socket.handshake.headers.authorization;

      if (!rawToken) {
        socket.emit('error', {
          status: 'fail',
          message: 'Token not found',
        });

        return;
      }
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);
      socket.data.user = user;
      socket.data.token = token;
      socket.data.type = payload.type;

      this.roomsService.enterRoom(socket, 'lobby');

      this.server.in('lobby').emit('lobby_connect', {
        userName: socket.data.user.name,
        message: `${socket.data.user.name} is connected to lobby`,
        userList: this.roomsService.getAllClient('lobby'),
        gameRoomList: this.roomsService.getAllGameRoom(),
      });
    } catch (e) {
      console.log(e);
      throw new WsException('Token is invalid');
    }
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('create_room')
  createRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { capacity, roomName } = data;
    console.log(client.data);

    const roomInfo = this.roomsService.createRoom(client, roomName, capacity);
    client.emit('create_room', {
      status: 'success',
      message: '방이 생성되었습니다.',
      ...roomInfo,
    });

    this.server.in('lobby').emit('user_create_room', {
      ...this.roomsService.getGameRoom(roomInfo.roomId),
      userName: client.data.user.name,
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('enter_room')
  enterRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;

    const roomInfo = this.roomsService.getGameRoom(roomId);
    if (roomInfo.userCount >= roomInfo.capacity) {
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

    client.to(roomId).emit('user_enter_room', {
      userName: client.data.user.name,
      message: `${client.data.user.name} 님이 ${
        this.roomsService.getGameRoom(roomId).roomName
      } 방에 접속했습니다.`,
    });

    this.server.in('lobby').emit('lobby_exit', {
      userName: client.data.user.name,
      message: `${client.data.user.name} is disconnected from lobby`,
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('exit_room')
  exitRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;

    this.roomsService.exitRoom(client, roomId);

    // client.emit('exit_room', {
    //   status: 'success',
    //   message: '방에서 퇴장했습니다.',
    //   userName: client.user.name,
    //   clientList: this.roomsService.getAllClient('lobby'),
    //   gameRoomList: this.roomsService.getAllGameRoom(),
    // });

    this.server.in(roomId).emit('user_exit_room', {
      userName: client.data.user.name,
      message: `${client.data.user.name} 님이 ${
        this.roomsService.getGameRoom(roomId).roomName
      } 방에서 나갔습니다.`,
    });

    this.server.in('lobby').emit('lobby_connect', {
      userName: client.data.user.name,
      message: `${client.data.user.name} is connected to lobby`,
      userList: this.roomsService.getAllClient('lobby'),
      gameRoomList: this.roomsService.getAllGameRoom(),
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('lobby_exit')
  exitLobby(@ConnectedSocket() client: Socket) {
    this.roomsService.exitLobby(client);

    this.server.in('lobby').emit('lobby_exit', {
      userName: client.data.user.name,
      message: `${client.data.user.name} is disconnected from lobby`,
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('chat')
  chat(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId, message } = data;

    client.to(roomId).emit('chat', {
      userName: client.data.user.name,
      message,
    });
  }
}
