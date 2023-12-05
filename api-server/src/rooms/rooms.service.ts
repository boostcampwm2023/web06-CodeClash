import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import { CreateRoomInfo, Room, RoomInfo, User } from './entities/room.entity';
import { RoomsInputDto } from './dtos/rooms.input.dto';
import RoomsInviteDto from './dtos/rooms.invite.dto';
import { LOBBY_ID } from './rooms.constants';
import { WsException } from '@nestjs/websockets';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RoomsService {
  private logger = new Logger('RoomsService');
  private roomList: Record<string, Room> = {
    lobby: {
      roomId: 'lobby',
      roomName: '로비',
      userList: [],
      capacity: 1000,
      state: 'waiting',
      timer: null,
      itmeCreater: null,
    },
  };

  private userNameSocketMapper = new Map();

  constructor() {}

  roomInfo(roomId: string) {
    const room = this.roomList[roomId];

    return {
      ...room,
      userList: room.userList.map((user) => {
        return {
          userName: user.data.user.name,
          ready: user.data.ready,
        };
      }),
    };
  }

  lobbyInfo() {
    const lobby = this.roomList[LOBBY_ID];

    return {
      ...lobby,
      userList: lobby.userList.map((user) => {
        return {
          userName: user.data.user.name,
        };
      }),
    };
  }

  createRoom(client: Socket, roomName: string, capacity: number): string {
    const roomId = uuid();

    this.exitRoom(client, 'lobby');

    this.roomList[roomId] = {
      roomId,
      roomName,
      userList: [],
      capacity,
      state: 'waiting',
      timer: null,
      itmeCreater: null,
    };

    this.enterRoom(client, roomId);

    return roomId;
  }

  enterRoom(client: Socket, roomId: string) {
    client.join(roomId);
    client.data.roomId = roomId;
    this.roomList[roomId].userList.push(client);
  }

  exitRoom(client: Socket, roomId: string) {
    if (client.rooms.size) {
      client.leave(roomId);
      client.data.ready = false;
    }
    this.deleteUserFromList(client, roomId);

    if (roomId !== 'lobby' && this.roomList[roomId].userList.length === 0) {
      delete this.roomList[roomId];
    }
  }

  getGameRoom(roomId: string): RoomInfo {
    if (!this.roomList[roomId]) {
      return undefined;
    }

    const room = this.roomList[roomId];

    return {
      roomId,
      roomName: room.roomName,
      capacity: room.capacity,
      userCount: room.userList.length,
      state: room.state,
    };
  }

  getAllGameRoom(): RoomInfo[] {
    return Object.values(this.roomList)
      .map((room) => {
        if (room.roomId !== 'lobby') {
          return {
            roomId: room.roomId,
            roomName: room.roomName,
            capacity: room.capacity,
            userCount: room.userList.length,
            state: room.state,
          };
        } else {
          return null;
        }
      })
      .filter((room) => {
        if (room) return true;
      });
  }

  changeReadyStatus(client: Socket) {
    client.data.ready = !client.data.ready;

    return client.data.ready;
  }

  checkUsersReady(roomId: string) {
    return this.roomList[roomId].userList.every((user) => user.data.ready);
  }

  getAllClient(roomId: string): User[] {
    return this.roomList[roomId].userList.map((user) => {
      return {
        userName: user.data.user.name,
        ready: user.data.ready,
      };
    });
  }

  registerUserSocket(client: Socket, userName: string) {
    this.userNameSocketMapper.set(userName, client);
  }

  getUserSocket(userName: string) {
    return this.userNameSocketMapper.get(userName);
  }

  deleteUserSocket(userName: string) {
    this.userNameSocketMapper.delete(userName);
  }

  deleteUserFromList(client: Socket, roomId: string) {
    this.roomList[roomId].userList = this.roomList[roomId].userList.filter(
      (user) => user.id !== client.id,
    );
  }

  isConnctedUser(userName: string) {
    return this.userNameSocketMapper.has(userName);
  }

  changeRoomState(roomId: string, state: 'waiting' | 'playing') {
    this.roomList[roomId].state = state;
  }

  setTimer(roomId: string, timer: NodeJS.Timeout) {
    this.roomList[roomId].timer = timer;
  }

  getTimer(roomId: string): NodeJS.Timeout | null {
    return this.roomList[roomId].timer;
  }

  allUserPassed(roomId: string) {
    return this.roomList[roomId].userList.every(
      (user) => user.data.user.passed,
    );
  }

  gameOver(roomId: string) {
    this.roomList[roomId].userList.forEach((user) => {
      user.data.passed = false;
      user.data.ready = false;
    });
    this.changeRoomState(roomId, 'waiting');
    this.roomList[roomId].timer = null;
  }

  roomHasUser(roomId: string, userId: string) {
    return this.roomList[roomId].userList.some(
      (user) => user.data.user.id === userId,
    );
  }

  invite(dto: RoomsInviteDto) {
    const { roomId, targetUserRoomId, userName } = dto;
    const { roomName, state, capacity, userCount } = this.getGameRoom(roomId);

    if (targetUserRoomId !== 'lobby') {
      this.logger.log(
        `[invite] ${userName} 사용자가 로비에 없는 사용자를 초대함`,
      );
      throw new WsException('초대한 유저가 로비에 없습니다.');
    }

    if (roomId === 'lobby') {
      this.logger.log(`[invite] ${userName} 사용자가 로비에서 초대를 시도함`);
      throw new WsException('로비에서는 초대할 수 없습니다.');
    }

    if (state !== 'waiting') {
      this.logger.log(
        `[invite] ${userName} 사용자가 이미 게임이 시작된 방에 초대를 시도함`,
      );
      throw new WsException('이미 게임이 시작된 방에는 초대할 수 없습니다.');
    }

    if (userCount >= capacity) {
      this.logger.log(`[invite] ${userName} 사용자가 꽉 찬 방에 초대를 시도함`);

      throw new WsException('꽉 찬 방에는 초대할 수 없습니다.');
    }

    return {
      status: 'success',
      roomId,
      roomName,
      userCount,
      capacity,
      userName,
    };
  }
}
