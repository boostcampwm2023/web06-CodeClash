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
import { WsExceptionFilter } from 'src/common/exception-filter/ws.exception.filter';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { ProblemsService } from 'src/problems/problems.service';
import {
  ITEM_CREATE_CYCLE as CREATE_ITEM_CYCLE,
  DEFAULT_RANKING,
  ITEM_DELAY,
  LOBBY_ID,
  NUM_OF_ROUNDS,
  ROOM_STATE,
  WS_STATUS,
  TIME_LIMIT,
} from './rooms.constants';
import RoomsInviteDto from './dtos/rooms.invite.dto';
import { plainToClass } from 'class-transformer';
import { RoomsUserDto } from './dtos/rooms.user.dto';
import { ScoresService } from 'src/scores/scores.service';
import { ScoreSubmissionDto } from 'src/scores/dto/score-submission.dto';
import { SubmissionLanguage } from 'src/submissions/entities/submission.entity';

@WebSocketGateway({
  namespace: 'rooms',
  path: '/api/rooms',
  cors: true,
})
@UseFilters(WsExceptionFilter)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RoomsGateway {
  private readonly logger = new Logger(RoomsGateway.name);

  constructor(
    private readonly roomsService: RoomsService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly problemsService: ProblemsService,
    private readonly scoresService: ScoresService,
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

    try {
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
    } catch (e) {
      this.logger.error(e);
      socket.emit('error', e.message);
    }
  }

  @SubscribeMessage('lobby_info')
  lobbyInfo() {
    return this.roomsService.lobbyInfo();
  }

  @SubscribeMessage('room_info')
  roomInfo(@MessageBody() data) {
    const roomInfo = this.roomsService.roomInfo(data.roomId);

    this.logger.log(`[roomInfo] ${data.userName} requested room info`);
    return roomInfo;
  }

  @SubscribeMessage('enter_lobby')
  enterLobby(@ConnectedSocket() client: Socket) {
    const roomsUserDto = plainToClass(RoomsUserDto, {
      socketId: client.id,
      userName: client.data.user.name,
      ready: false,
      passed: false,
      ranking: DEFAULT_RANKING,
      itemList: {},
    });

    this.roomsService.enterRoom(LOBBY_ID, client.data.roomId, roomsUserDto);
    client.join(LOBBY_ID);
    client.data.roomId = LOBBY_ID;
    client.to(LOBBY_ID).emit('user_enter_lobby', {
      userName: roomsUserDto.userName,
    });

    return { status: WS_STATUS.SUCCESS };
  }

  @SubscribeMessage('exit_lobby')
  exitLobby(@ConnectedSocket() client: Socket) {
    this.roomsService.exitRoom(LOBBY_ID, client.data.user.name);
    client.leave(LOBBY_ID);
    this.io.in(LOBBY_ID).emit('user_exit_lobby', {
      userName: client.data.user.name,
    });

    return { status: WS_STATUS.SUCCESS };
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
      status: WS_STATUS.SUCCESS,
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
      ranking: DEFAULT_RANKING,
      itemList: {},
    });

    this.roomsService.enterRoom(roomId, client.data.roomId, dto);
    client.join(roomId);
    client.data.roomId = roomId;
    this.logger.log(`[enterRoom] ${client.data.user.name} entered ${roomId}`);
    client.to(roomId).emit('user_enter_room', { userName: dto.userName });
    this.io.in(LOBBY_ID).emit('change_user_count', {
      roomId,
      userCount: this.roomsService.roomUserCount(roomId),
    });

    return {
      status: WS_STATUS.SUCCESS,
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

    return { status: WS_STATUS.SUCCESS, roomId };
  }

  @SubscribeMessage('chat')
  chat(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = client.data;
    const { message } = data;

    this.io.in(roomId).emit('chat', {
      userName: client.data.user.name,
      message,
    });

    return { status: WS_STATUS.SUCCESS };
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

    return { status: WS_STATUS.SUCCESS };
  }

  @SubscribeMessage('ready')
  async ready(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const ready = this.roomsService.switchReady(roomId, userName);
    const userCount = this.roomsService.roomUserCount(roomId);

    this.io.in(roomId).emit('ready', { userName, ready });
    if (userCount > 1 && this.roomsService.allUserReady(roomId)) {
      await this.start(roomId);
    }

    return { status: WS_STATUS.SUCCESS };
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

    return { status: WS_STATUS.SUCCESS };
  }

  @SubscribeMessage('item')
  useItem(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const { item } = data;

    this.roomsService.useItem(roomId, userName, item);
    client.to(roomId).emit('item', {
      status: WS_STATUS.SUCCESS,
      userName,
      item,
    });

    return { status: WS_STATUS.SUCCESS };
  }

  @SubscribeMessage('submission')
  async submission(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { id, code, isExample } = data;
    const dto: ScoreSubmissionDto = {
      code,
      language: SubmissionLanguage.JAVASCRIPT,
      problemId: id,
    };
    const results = await this.scoresService.grade(
      dto,
      client.data.user,
      isExample,
    );

    if (isExample) return { results };

    let passed = false;
    const { roomId } = client.data;
    const user = this.roomsService.roomUser(roomId, client.data.user.name);
    let timer = this.roomsService.getTimer(roomId);
    passed = results.every((result) => result.status === 'pass');

    if (passed) {
      user.ranking = this.roomsService.roomPassedUserCount(roomId) + 1;
      user.passed = true;

      this.logger.log(
        `[submission] ${client.data.user.name} passed, ranking: ${user.ranking}`,
      );

      if (this.roomsService.allUserPassed(roomId)) {
        this.roomsService.gameover(roomId);
        this.io.in(roomId).emit('game_over');
        this.io.in('lobby').emit('room_game_over', { roomId });
      }

      if (!timer) {
        timer = setTimeout(() => {
          this.roomsService.gameover(roomId);
          this.io.in(roomId).emit('game_over');
          this.io.in('lobby').emit('room_game_over', { roomId });
        }, TIME_LIMIT);

        await this.usersService.increaseWinCount(user.userName);
        this.roomsService.setTimer(roomId, timer);
        this.io.in(roomId).emit('countdown');
      }
    }

    return { results, passed };
  }

  @SubscribeMessage('result_info')
  result_info(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;
    const resultInfo = this.roomsService.roomRanking(roomId);

    return { status: WS_STATUS.SUCCESS, resultInfo };
  }

  @SubscribeMessage('exit_result')
  exitResult(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;

    if (this.roomsService.roomHasUser(roomId, client.data.user.name)) {
      return { status: WS_STATUS.SUCCESS };
    }
  }

  @SubscribeMessage('invite')
  invite(@ConnectedSocket() client: Socket, @MessageBody() data) {
    const { roomId } = client.data;
    const { name: userName } = client.data.user;
    const { roomName } = this.roomsService.roomInfo(roomId);
    const targetSocket = this.roomsService.socket(data.userName);
    const dto = plainToClass(RoomsInviteDto, {
      roomId,
      userName,
      targetUserName: data.userName,
      targetUserRoomId: targetSocket.data.roomId,
    });

    this.roomsService.invite(dto);
    targetSocket.emit('invite', {
      roomId: dto.roomId,
      roomName,
      userName,
    });

    return { status: WS_STATUS.SUCCESS };
  }

  private async createItem(roomId: string) {
    const activeUserList = this.roomsService.canRecieveUserList(roomId);

    await Promise.all(
      activeUserList.map(async (userName) => {
        const socket = this.roomsService.socket(userName);
        const item = this.roomsService.assignItem(roomId, userName);

        this.logger.log(`[createItem] Item created for ${userName}`);
        this.io.to(socket.id).emit('create_item', { item });
        this.logger.log(`[createItem] Item sent to ${userName}`);
      }),
    );
  }

  private async start(roomId: string) {
    const problems =
      await this.problemsService.findProblemsWithTestcases(NUM_OF_ROUNDS);
    const promises = this.roomsService.room(roomId).userList.map((user) => {
      return this.usersService.increaseTotalCount(user.userName);
    });

    await Promise.all(promises);
    await this.roomsService.gameInit(roomId);
    this.io.in(roomId).emit('start', { problems });
    setTimeout(async () => {
      await this.createItem(roomId);

      const itemCreator = setInterval(async () => {
        await this.createItem(roomId);
      }, CREATE_ITEM_CYCLE);

      this.roomsService.setItemCreator(roomId, itemCreator);
    }, ITEM_DELAY);
    this.io
      .in(LOBBY_ID)
      .emit('room_start', { roomId, state: ROOM_STATE.PLAYING });
  }
}
