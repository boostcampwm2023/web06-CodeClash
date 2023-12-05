import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { RoomsService } from './rooms.service';
import { Server, Socket } from 'socket.io';
import { Logger, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { HttpToSocketExceptionFilter } from 'src/common/exception-filter/http-to-ws.exception';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ProblemsService } from 'src/problems/problems.service';
import { LOBBY_ID, NUM_OF_ROUNDS, TIME_LIMIT } from './rooms.constants';
import { RoomsInputDto } from './dtos/rooms.input.dto';
import RoomsInviteDto from './dtos/rooms.invite.dto';
import { plainToClass } from 'class-transformer';
import { RoomsUserDto } from './dtos/rooms.user.dto';

@WebSocketGateway({
  namespace: 'rooms',
  path: '/api/rooms',
  cors: true,
})
@UseFilters(HttpToSocketExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RoomsGateway {
  private readonly logger = new Logger(RoomsGateway.name);

  constructor(
    private readonly roomsService: RoomsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly problemsService: ProblemsService,
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
      socket.data.ready = false;
      socket.data.passed = false;
      socket.data.token = token;
      socket.data.type = payload.type;

      this.roomsService.registerUserSocket(socket, user.name);
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

    this.roomsService.exitRoom(socket.data.roomId, socket.data.user.name);
    this.roomsService.deleteUserSocket(socket.data.user.name);
    if (socket.data.roomId) {
      if (socket.data.roomId === LOBBY_ID) {
        this.server.in(socket.data.roomId).emit('user_exit_lobby', {
          userName: socket.data.user.name,
          message: `${socket.data.user.name} ${socket.data.roomId} 방에서 나갔습니다.`,
        });
      } else {
        if (this.roomsService.roomInfo(socket.data.roomId)) {
          this.server.in(socket.data.roomId).emit('user_exit_room', {
            userName: socket.data.user.name,
            message: `${socket.data.user.name} ${socket.data.roomId} 방에서 나갔습니다.`,
          });
        } else {
          this.server
            .in('lobby')
            .emit('delete_room', { roomId: socket.data.roomId });
        }
      }
    }
  }

  @SubscribeMessage('lobby_info')
  lobbyInfo(@ConnectedSocket() client: Socket) {
    return this.roomsService.lobbyInfo();
  }

  @SubscribeMessage('room_info')
  roomInfo(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RoomsInputDto,
  ) {
    return this.roomsService.roomInfo(data.roomId);
  }

  @SubscribeMessage('enter_lobby')
  enterLobby(@ConnectedSocket() client: Socket) {
    const roomsUserDto = plainToClass(RoomsUserDto, {
      socketId: client.id,
      userName: client.data.user.name,
      ready: false,
      passed: false,
      itemList: {},
    });

    this.roomsService.enterRoom(LOBBY_ID, client.data.roomId, roomsUserDto);
    client.join(LOBBY_ID);
    client.data.roomId = LOBBY_ID;
    client.to(LOBBY_ID).emit('user_enter_lobby', {
      userName: roomsUserDto.userName,
    });

    return { status: 'success' };
  }

  @SubscribeMessage('exit_lobby')
  exitLobby(@ConnectedSocket() client: Socket) {
    this.roomsService.exitRoom(LOBBY_ID, client.data.user.name);
    client.rooms.clear();
    this.server.in(LOBBY_ID).emit('user_exit_lobby', {
      userName: client.data.user.name,
    });

    return { status: 'success' };
  }

  @SubscribeMessage('create_room')
  createRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { capacity, roomName } = data;
    const roomId = this.roomsService.createRoom(roomName, capacity);

    this.server.in('lobby').emit('user_create_room', {
      ...this.roomsService.roomInfo(roomId),
      userName: client.data.user.name,
    });

    return {
      status: 'success',
      roomId,
    };
  }

  @SubscribeMessage('enter_room')
  enterRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;
    const dto = plainToClass(RoomsUserDto, {
      socketId: client.id,
      userName: client.data.user.name,
      ready: false,
      itemList: {},
    });

    this.roomsService.enterRoom(roomId, client.data.roomId, dto);
    client.join(roomId);
    client.data.roomId = roomId;

    client.to(roomId).emit('user_enter_room', {
      userName: dto.userName,
      message: `${dto.userName} 님이 ${
        this.roomsService.getGameRoom(roomId).roomName
      } 방에 접속했습니다.`,
    });

    return {
      status: 'success',
      roomId,
    };
  }

  @SubscribeMessage('exit_room')
  exitRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;

    this.logger.log('exit_room gateway roomID ' + roomId);
    const { userName } = client.data.user;
    const roomExists = this.roomsService.exitRoom(roomId, userName);

    this.logger.log('exit_room gateway roomExists ' + roomExists);
    client.rooms.clear();
    if (roomExists) {
      this.server.in(roomId).emit('user_exit_room', { userName });
    } else {
      this.server.in(LOBBY_ID).emit('delete_room', { roomId });
    }

    return { status: 'success', roomId };
  }

  @SubscribeMessage('chat')
  chat(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId, message } = data;

    this.server.in(roomId).emit('chat', {
      userName: client.data.user.name,
      message,
    });
  }

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

  @SubscribeMessage('ready')
  async ready(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = data;

    this.server.in(roomId).emit('ready', {
      userName: client.data.user.name,
      ready: this.roomsService.changeReadyStatus(client),
    });

    if (this.roomsService.allUserReady(roomId)) {
      const problems =
        await this.problemsService.findProblemsWithTestcases(NUM_OF_ROUNDS);

      this.roomsService.changeRoomState(roomId, 'playing');
      this.server.in(roomId).emit('start', {
        status: 'start',
        problems,
      });

      this.server.in('lobby').emit('room_start', {
        roomId,
      });
    }
  }

  /*
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
      });
    }
  }
*/

  @SubscribeMessage('item')
  item(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId, item } = data;

    client.to(roomId).emit('item', {
      userName: client.data.user.name,
      item,
    });
  }

  @SubscribeMessage('pass')
  pass(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    let timer = this.roomsService.getTimer(roomId);

    client.data.passed = true;

    if (this.roomsService.allUserPassed(roomId) && timer) {
      clearTimeout(timer);
      this.roomsService.gameOver(roomId);
      this.server.in(roomId).emit('game_over');
      this.server.in('lobby').emit('room_game_over', { roomId });

      return;
    }

    if (timer) return;

    timer = setTimeout(() => {
      this.roomsService.gameOver(roomId);
      this.server.in(roomId).emit('game_over');
      this.server.in('lobby').emit('room_game_over', { roomId });
    }, TIME_LIMIT);

    this.roomsService.setTimer(roomId, timer);
    this.server.in(roomId).emit('countdown');
  }

  @SubscribeMessage('exit_result')
  exitResult(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;

    if (this.roomsService.roomHasUser(roomId, client.data.user.id)) {
      client.emit('exit_result');
    }
  }

  @SubscribeMessage('invite')
  invite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RoomsInputDto,
  ) {
    const targetUserSocket = this.roomsService.getUserSocket(data.userName);
    const dto = plainToClass(RoomsInviteDto, {
      roomId: client.data.roomId,
      targetUserRoomId: targetUserSocket.data.roomId,
      userName: client.data.user.name,
    });
    const inviteInfo = this.roomsService.invite(
      plainToClass(RoomsInviteDto, dto),
    );

    targetUserSocket.emit('invite', inviteInfo);

    return { status: 'success' };
  }
}
