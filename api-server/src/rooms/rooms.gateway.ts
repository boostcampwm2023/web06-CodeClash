import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';
import { UseFilters } from '@nestjs/common';
import { HttpToSocketExceptionFilter } from 'src/common/exception-filter/http-to-ws.exception';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@WebSocketGateway({
  namespace: 'rooms',
  path: '/api/rooms',
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
    const rawToken = socket.handshake.headers.authorization;

    if (!rawToken) {
      socket.emit('connection', {
        status: 'fail',
        message: 'Token not found',
      });

      socket.disconnect();
      return;
    }

    try {
      const token = this.authService.extractTokenFromHeader(rawToken, true);
      const payload = this.authService.verifyToken(token);
      const user = await this.usersService.getUserByEmail(payload.email);

      if (this.roomsService.isConnctedUser(user.name)) {
        socket.emit('connection', {
          status: 'fail',
          message: 'Already connected user',
        });

        socket.disconnect();
        return;
      }

      socket.data.user = user;
      socket.data.user.ready = false;
      socket.data.token = token;
      socket.data.type = payload.type;

      this.server.in('lobby').emit('user_enter_lobby', {
        userName: socket.data.user.name,
        message: `${socket.data.user.name} is connected to lobby`,
      });

      this.roomsService.enterRoom(socket, 'lobby');
      this.roomsService.registerUserSocket(socket, user.name);

      socket.emit('connection', {
        status: 'success',
        message: '로비에 접속했습니다.',
        userList: this.roomsService.getAllClient('lobby'),
        gameRoomList: this.roomsService.getAllGameRoom(),
      });
    } catch (e) {
      socket.emit('connection', {
        status: 'fail',
        message: 'Token is invalid',
      });

      socket.disconnect();
    }
  }

  async handleDisconnect(socket: Socket) {
    if (!socket.data.user) {
      return;
    }

    this.roomsService.exitRoom(socket, socket.data.roomId);
    this.roomsService.deleteUserSocket(socket.data.user.name);
    if (socket.data.roomId) {
      if (socket.data.roomId === 'lobby') {
        this.server.in(socket.data.roomId).emit('user_exit_lobby', {
          userName: socket.data.user.name,
          message: `${socket.data.user.name} ${socket.data.roomId} 방에서 나갔습니다.`,
        });
      } else {
        if (this.roomsService.getGameRoom(socket.data.roomId)) {
          this.server.in(socket.data.roomId).emit('user_exit_room', {
            userName: socket.data.user.name,
            message: `${socket.data.user.name} ${socket.data.roomId} 방에서 나갔습니다.`,
          });
        } else {
          this.server.in('lobby').emit('delete_room', {
            roomId: socket.data.roomId,
          });
        }
      }
    }
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('create_room')
  createRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { capacity, roomName } = data;

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

    if (roomInfo.state !== 'waiting') {
      client.emit('enter_room', {
        status: 'fail',
        message: '이미 시작된 방입니다.',
      });
      return;
    }

    this.roomsService.exitRoom(client, 'lobby');
    this.server.in('lobby').emit('user_exit_lobby', {
      userName: client.data.user.name,
      message: `${client.data.user.name} is disconnected from lobby`,
    });

    this.server.in(roomId).emit('user_enter_room', {
      userName: client.data.user.name,
      message: `${client.data.user.name} 님이 ${
        this.roomsService.getGameRoom(roomId).roomName
      } 방에 접속했습니다.`,
    });

    this.roomsService.enterRoom(client, roomId);
    client.emit('enter_room', {
      status: 'success',
      message: '방에 입장했습니다.',
      userList: this.roomsService.getAllClient(roomId),
      ...roomInfo,
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('exit_room')
  exitRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;

    this.roomsService.exitRoom(client, roomId);
    if (this.roomsService.getGameRoom(roomId)) {
      this.server.in(roomId).emit('user_exit_room', {
        userName: client.data.user.name,
        message: `${client.data.user.name} 님이 ${
          this.roomsService.getGameRoom(roomId).roomName
        } 방에서 나갔습니다.`,
      });
    } else {
      this.server.in('lobby').emit('delete_room', {
        roomId,
      });
    }

    this.server.in('lobby').emit('user_enter_lobby', {
      userName: client.data.user.name,
      message: `${client.data.user.name} is connected to lobby`,
    });

    this.roomsService.enterRoom(client, 'lobby');
    client.emit('exit_room', {
      status: 'success',
      message: '방에서 나왔습니다.',
      userList: this.roomsService.getAllClient('lobby'),
      gameRoomList: this.roomsService.getAllGameRoom(),
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('chat')
  chat(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId, message } = data;

    this.server.in(roomId).emit('chat', {
      userName: client.data.user.name,
      message,
    });
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('dm')
  dm(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { userName, message } = data;
    const targetUser = this.roomsService.getUserSocket(userName);

    if (!targetUser) {
      client.emit('dm', {
        status: 'fail',
        message: '접속하지 않은 유저입니다.',
      });
    } else {
      client.emit('dm', {
        status: 'success',
        message: 'DM을 보냈습니다.',
      });

      this.server.to(targetUser.id).emit('user_dm', {
        userName: client.data.user.name,
        message,
      });
    }
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('ready')
  ready(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;

    this.server.in(roomId).emit('ready', {
      userName: client.data.user.name,
      ready: this.roomsService.changeReadyStatus(client),
    });

    if (this.roomsService.checkUsersReady(roomId)) {
      this.server.in(roomId).emit('start', {
        status: 'start',
        message: '게임을 시작합니다.',
      });

      this.roomsService.changeRoomState(roomId, 'playing');
    }
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('kick')
  kick(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { userName, roomId } = data;
    const targetUser = this.roomsService.getUserSocket(userName);

    if (!targetUser) {
      client.emit('kick', {
        status: 'fail',
        message: '접속하지 않은 유저입니다.',
      });
    } else {
      client.emit('kick', {
        status: 'success',
        message: '유저를 강퇴했습니다.',
      });

      this.server.to(targetUser.id).emit('kick', {
        status: 'success',
        message: '강퇴당했습니다.',
      });

      this.roomsService.exitRoom(targetUser, roomId);
      this.server.in(roomId).emit('user_exit_room', {
        userName: targetUser.data.user.name,
        message: `${targetUser.data.user.name} 님이 ${
          this.roomsService.getGameRoom(roomId).roomName
        } 방에서 나갔습니다.`,
      });

      this.server.in('lobby').emit('user_enter_lobby', {
        userName: targetUser.data.user.name,
        message: `${targetUser.data.user.name} is connected to lobby`,
      });

      this.roomsService.enterRoom(targetUser, 'lobby');
      targetUser.emit('exit_room', {
        status: 'success',
        message: '방에서 강퇴되었습니다..',
        userList: this.roomsService.getAllClient('lobby'),
        gameRoomList: this.roomsService.getAllGameRoom(),
      });
    }
  }

  @UseFilters(HttpToSocketExceptionFilter)
  @SubscribeMessage('item')
  item(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId, item } = data;

    this.server.in(roomId).emit('item', {
      item,
    });
  }
}
