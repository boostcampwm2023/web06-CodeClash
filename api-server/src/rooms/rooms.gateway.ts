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
import {
  ITEM_CREATE_CYCLE as CREATE_ITEM_CYCLE,
  EVENT,
  LOBBY_ID,
  NUM_OF_ROUNDS,
  ROOM_STATE,
  SUCCESS_STATUS,
  TIME_LIMIT,
} from './rooms.constants';
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
  io: Server;

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

      if (this.roomsService.isConnectedUser(user.name)) {
        socket.emit('connection', {
          status: 'fail',
          message: 'Already connected user',
        });

        socket.disconnect();
        return;
      }

      socket.data.user = user;
      socket.data.token = token;
      socket.data.type = payload.type;
      this.roomsService.registerSocket(user.name, socket);
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

    const { roomId } = socket.data;
    const { name: userName } = socket.data.user;

    this.roomsService.deleteSocket(userName);

    if (this.roomsService.roomExists(roomId)) {
      this.roomsService.exitRoom(roomId, userName);
    }

    if (roomId === LOBBY_ID) {
      this.io.in(roomId).emit('user_exit_lobby', { userName });
    } else {
      if (this.roomsService.roomExists(roomId)) {
        this.io.in(roomId).emit('user_exit_room', { userName });
      } else {
        this.io.in(LOBBY_ID).emit('delete_room', { roomId });
      }
    }

    this.logger.log(`[handleDisconnect] ${userName} disconnected`);
  }

  @SubscribeMessage('lobby_info')
  lobbyInfo() {
    return this.roomsService.lobbyInfo();
  }

  @SubscribeMessage('room_info')
  roomInfo(@MessageBody() data: RoomsInputDto) {
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

    return { status: SUCCESS_STATUS };
  }

  @SubscribeMessage('exit_lobby')
  exitLobby(@ConnectedSocket() client: Socket) {
    this.roomsService.exitRoom(LOBBY_ID, client.data.user.name);
    client.leave(LOBBY_ID);
    this.io.in(LOBBY_ID).emit('user_exit_lobby', {
      userName: client.data.user.name,
    });

    return { status: SUCCESS_STATUS };
  }

  @SubscribeMessage('create_room')
  createRoom(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { capacity, roomName } = data;
    const roomId = this.roomsService.createRoom(roomName, capacity);

    this.io.in('lobby').emit('user_create_room', {
      ...this.roomsService.roomInfo(roomId),
      userName: client.data.user.name,
    });

    return {
      status: SUCCESS_STATUS,
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
      passed: false,
      itemList: {},
    });

    this.roomsService.enterRoom(roomId, client.data.roomId, dto);
    client.join(roomId);
    client.data.roomId = roomId;
    client.to(roomId).emit('user_enter_room', { userName: dto.userName });
    this.io.in(LOBBY_ID).emit('change_user_count', {
      roomId,
      userCount: this.roomsService.roomUserCount(roomId),
    });

    return {
      status: SUCCESS_STATUS,
      roomId,
    };
  }

  @SubscribeMessage('exit_room')
  exitRoom(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const roomExists = this.roomsService.exitRoom(roomId, userName);

    client.leave(roomId);
    if (roomExists) {
      this.io.in(roomId).emit('user_exit_room', { userName });
      this.io.in(LOBBY_ID).emit('change_user_count', {
        roomId,
        userCount: this.roomsService.roomUserCount(roomId),
      });
    } else {
      this.io.in(LOBBY_ID).emit('delete_room', { roomId });
    }

    return { status: SUCCESS_STATUS, roomId };
  }

  @SubscribeMessage('chat')
  chat(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = client.data;
    const { message } = data;

    this.io.in(roomId).emit('chat', {
      userName: client.data.user.name,
      message,
    });

    return { status: SUCCESS_STATUS };
  }

  @SubscribeMessage('dm')
  dm(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { userName, message } = data;
    const targetSocketId = this.roomsService.socket(userName).id;

    this.roomsService.dm(client.data.user.name);
    this.io.to(targetSocketId).emit('user_dm', {
      userName: client.data.user.name,
      message,
    });

    return { status: SUCCESS_STATUS };
  }

  @SubscribeMessage('ready')
  async ready(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const ready = this.roomsService.switchReady(roomId, userName);

    this.io.in(roomId).emit('ready', { userName, ready });
    if (this.roomsService.allUserReady(roomId)) {
      await this.start(roomId);
    }

    return { status: SUCCESS_STATUS };
  }

  @SubscribeMessage('kick')
  kick(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const { userName: targetUserName } = data;
    const targetSocket = this.roomsService.socket(targetUserName);

    this.roomsService.kick(roomId, userName, targetUserName);
    targetSocket.leave(roomId);
    targetSocket.emit('kick', { roomId, userName });
    this.io.in(roomId).emit('user_exit_room', { userName: targetUserName });
    this.io.in(LOBBY_ID).emit('change_user_count', {
      roomId,
      userCount: this.roomsService.roomUserCount(roomId),
    });

    return { status: SUCCESS_STATUS };
  }

  @SubscribeMessage('item')
  useItem(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const { item } = data;

    this.roomsService.useItem(roomId, userName, item);
    client.to(roomId).emit('item', {
      status: SUCCESS_STATUS,
      userName,
      item,
    });

    return { status: SUCCESS_STATUS };
  }

  // @SubscribeMessage('pass')
  // pass(@ConnectedSocket() client: Socket) {
  //   const { roomId } = client.data;
  //   let timer = this.roomsService.getTimer(roomId);

  //   client.data.passed = true;

  //   if (this.roomsService.allUserPassed(roomId) && timer) {
  //     clearTimeout(timer);
  //     this.roomsService.gameOver(roomId);
  //     this.server.in(roomId).emit('game_over');
  //     this.server.in('lobby').emit('room_game_over', { roomId });

  //     return;
  //   }

  //   if (timer) return;

  //   timer = setTimeout(() => {
  //     this.roomsService.gameOver(roomId);
  //     this.server.in(roomId).emit('game_over');
  //     this.server.in('lobby').emit('room_game_over', { roomId });
  //   }, TIME_LIMIT);

  //   this.roomsService.setTimer(roomId, timer);
  //   this.server.in(roomId).emit('countdown');
  // }

  @SubscribeMessage('exit_result')
  exitResult(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;

    if (this.roomsService.roomHasUser(roomId, client.data.user.name)) {
      return { status: SUCCESS_STATUS };
    }
  }

  @SubscribeMessage('invite')
  invite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: RoomsInputDto,
  ) {
    const targetSocket = this.roomsService.socket(data.userName);
    const dto = plainToClass(RoomsInviteDto, {
      roomId: client.data.roomId,
      userName: client.data.user.name,
      targetUserName: data.userName,
      targetUserRoomId: targetSocket.data.roomId,
    });

    this.roomsService.invite(dto);
    targetSocket.emit('invite', { roomId: dto.roomId });

    return { status: SUCCESS_STATUS };
  }

  private createItem(roomId: string) {
    const userNameList = this.roomsService.userNameList(roomId);

    userNameList.forEach((userName) => {
      const socket = this.roomsService.socket(userName);
      const item = this.roomsService.assignItem(roomId, userName);

      this.logger.log(`[createItem] Item created for ${userName}`);
      this.io.to(socket.id).emit('create_item', { item });
      this.logger.log(`[createItem] Item sent to ${userName}`);
    });
  }

  private async start(roomId: string) {
    const problems =
      await this.problemsService.findProblemsWithTestcases(NUM_OF_ROUNDS);
    const itemCreator = setInterval(() => {
      this.createItem(roomId);
    }, CREATE_ITEM_CYCLE);

    this.roomsService.changeRoomState(roomId, ROOM_STATE.PLAYING);
    this.roomsService.setItemCreator(roomId, itemCreator);
    this.io.in(roomId).emit('start', { problems });
    this.createItem(roomId);
    this.io
      .in(LOBBY_ID)
      .emit('room_start', { roomId, state: ROOM_STATE.PLAYING });
  }
}
