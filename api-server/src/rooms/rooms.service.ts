import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Room, RoomInfo, User } from './entities/room.entity';
import { RoomsInputDto } from './dtos/rooms.input.dto';
import RoomsInviteDto from './dtos/rooms.invite.dto';
import {
  DEFAULT_ROOM_NAME,
  LOBBY_ID,
  MAX_ITEM_CAPACITY,
  MAX_LOBBY_CAPACITY,
  NUM_OF_ITEMS,
  ROOM_STATE,
  RoomState,
  SUCCESS_STATUS,
} from './rooms.constants';
import { WsException } from '@nestjs/websockets';
import { ItemList, RoomsUserDto } from './dtos/rooms.user.dto';

@Injectable()
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class RoomsService {
  private logger = new Logger('RoomsService');
  private roomList: Record<string, Room> = {
    lobby: {
      roomId: LOBBY_ID,
      roomName: '로비',
      userList: [],
      banList: new Set(),
      capacity: MAX_LOBBY_CAPACITY,
      state: ROOM_STATE.WAITING,
      timer: null,
      itemCreator: null,
    },
  };

  private userNameSocketIdMapper = new Map();

  constructor() {}

  roomInfo(roomId: string) {
    const room = this.roomList[roomId];

    if (!room) {
      return undefined;
    }

    return {
      ...room,
      userList: room.userList.map((user) => {
        return {
          userName: user.userName,
          ready: user.ready,
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
          userName: user.userName,
        };
      }),
      roomList: this.allGameRoom().map((room) => {
        return {
          roomId: room.roomId,
          roomName: room.roomName,
          capacity: room.capacity,
          userCount: room.userList.length,
          state: room.state,
        };
      }),
    };
  }

  createRoom(name: string, capacity: number): string {
    const roomId = uuid();
    const roomName = name ? name : DEFAULT_ROOM_NAME;

    this.roomList[roomId] = {
      roomId,
      roomName,
      userList: [],
      banList: new Set(),
      capacity,
      state: ROOM_STATE.WAITING,
      timer: null,
      itemCreator: null,
    };

    return roomId;
  }

  enterRoom(roomId: string, location: string, user: RoomsUserDto) {
    const { userList, capacity, state, banList } = this.roomInfo(roomId);

    if (location !== LOBBY_ID && roomId !== LOBBY_ID) {
      this.logger.log(
        `[enterRoom] ${user.userName} 사용자가 로비가 아닌 곳에서 입장을 시도함`,
      );
      throw new WsException('로비가 아닌 곳에서는 입장할 수 없습니다.');
    }

    if (userList.length >= capacity) {
      this.logger.log(
        `[enterRoom] ${user.userName} 사용자가 꽉 찬 방에 입장을 시도함`,
      );
      throw new WsException('꽉 찬 방에는 입장할 수 없습니다.');
    }

    if (state === ROOM_STATE.PLAYING) {
      this.logger.log(
        `[enterRoom] ${user.userName} 사용자가 이미 게임이 시작된 방에 입장을 시도함`,
      );
      throw new WsException('이미 게임이 시작된 방에는 입장할 수 없습니다.');
    }

    if (banList.has(user.userName)) {
      this.logger.log(
        `[enterRoom] ${user.userName} 사용자가 강퇴당한 방에 입장을 시도함`,
      );
      throw new WsException('이미 해당 방에서 강퇴당했습니다.');
    }

    this.roomList[roomId].userList.push(user);
  }

  exitRoom(roomId: string, userName: string) {
    if (!this.roomList[roomId]) {
      this.logger.log(
        `[exitRoom] ${userName} 사용자가 존재하지 않는 방에서 퇴장을 시도함`,
      );
      throw new WsException('존재하지 않는 방입니다.');
    }

    if (
      !this.roomList[roomId].userList.filter(
        (user) => user.userName === userName,
      ).length
    ) {
      this.logger.log(
        `[exitRoom] ${userName} 사용자가 방에 존재하지 않는 사용자임`,
      );
      throw new WsException('사용자가 방에 존재하지 않습니다.');
    }

    this.roomList[roomId].userList = this.roomList[roomId].userList.filter(
      (user) => user.userName !== userName,
    );

    if (roomId !== LOBBY_ID && this.roomList[roomId].userList.length === 0) {
      this.roomList[roomId].itemCreator &&
        clearTimeout(this.roomList[roomId].itemCreator);
      delete this.roomList[roomId];

      return false;
    }

    return true;
  }

  allUserReady(roomId: string) {
    return this.roomList[roomId].userList.every((user) => user.ready);
  }

  registerSocketId(userName: string, socketId: string) {
    this.userNameSocketIdMapper.set(userName, socketId);
  }

  socketId(userName: string) {
    return this.userNameSocketIdMapper.get(userName);
  }

  deleteSocketId(userName: string) {
    this.userNameSocketIdMapper.delete(userName);
  }

  isConnectedUser(userName: string) {
    return this.userNameSocketIdMapper.has(userName);
  }

  changeRoomState(roomId: string, state: RoomState) {
    this.roomList[roomId].state = state;
  }

  setTimer(roomId: string, timer: NodeJS.Timeout) {
    this.roomList[roomId].timer = timer;
  }

  getTimer(roomId: string): NodeJS.Timeout | null {
    return this.roomList[roomId].timer;
  }

  setItemCreator(roomId: string, itemCreater: NodeJS.Timeout) {
    this.roomList[roomId].itemCreator = itemCreater;
  }

  getItemCreator(roomId: string): NodeJS.Timeout | null {
    return this.roomList[roomId].itemCreator;
  }

  assignItem(roomId: string, userName: string) {
    const user = this.roomList[roomId].userList.find(
      (user) => user.userName === userName,
    );

    if (!user) {
      this.logger.log(
        `[assignItem] ${userName} 사용자가 존재하지 않는 사용자임`,
      );
      throw new WsException('사용자가 존재하지 않습니다.');
    }

    const itemCount = Object.values(user.itemList).reduce(
      (acc, cur) => acc + cur,
      0,
    );

    if (itemCount >= MAX_ITEM_CAPACITY) {
      return null;
    }

    const item = this.randomItem();

    if (user.itemList[item] === undefined) {
      user.itemList[item] = 1;
    } else {
      user.itemList[item] += 1;
    }

    return item;
  }

  allUserPassed(roomId: string) {
    return this.roomList[roomId].userList.every((user) => user.passed);
  }

  gameOver(roomId: string) {
    this.roomList[roomId].userList.forEach((user) => {
      user.passed = false;
      user.ready = false;
      user.itemList = {};
    });
    this.roomList[roomId].state = ROOM_STATE.WAITING;
    this.roomList[roomId].timer = null;
    this.roomList[roomId].itemCreator = null;
  }

  roomHasUser(roomId: string, userName: string) {
    return this.roomList[roomId].userList.some(
      (user) => user.userName === userName,
    );
  }

  roomUserCount(roomId: string) {
    return this.roomList[roomId].userList.length;
  }

  switchReady(roomId: string, userName: string) {
    const user = this.roomList[roomId].userList.find(
      (user) => user.userName === userName,
    );

    if (!user) {
      this.logger.log(
        `[switchReady] ${userName} 사용자가 존재하지 않는 사용자임`,
      );
      throw new WsException('사용자가 존재하지 않습니다.');
    }

    user.ready = !user.ready;

    return user.ready;
  }

  roomSocketIdList(roomId: string) {
    return this.roomList[roomId].userList.map((user) => user.socketId);
  }

  useItem(roomId: string, userName: string, item: ItemList) {
    const user = this.roomList[roomId].userList.find(
      (user) => user.userName === userName,
    );

    if (!user) {
      this.logger.log(`[item] ${userName} 사용자가 존재하지 않는 사용자임`);
      throw new WsException('사용자가 존재하지 않습니다.');
    }

    if (!user.itemList[item]) {
      this.logger.log(
        `[item] ${userName} 사용자가 존재하지 않는 아이템을 사용함`,
      );
      throw new WsException('존재하지 않는 아이템입니다.');
    }

    user.itemList[item] -= 1;

    if (user.itemList[item] === 0) {
      delete user.itemList[item];
    }
  }

  dm(targetSocketId: string) {
    if (!targetSocketId) {
      this.logger.log(`[dm] 존재하지 않는 사용자에게 DM을 시도함`);
      throw new WsException('존재하지 않는 사용자입니다.');
    }
  }

  kick(roomId: string, userName: string, targetUserName: string) {
    const targetUser = this.roomList[roomId].userList.find(
      (user) => user.userName === targetUserName,
    );

    if (!targetUser) {
      this.logger.log(`[kick] 존재하지 않는 사용자를 강퇴함`);
      throw new WsException('존재하지 않는 사용자입니다.');
    }

    if (roomId === LOBBY_ID) {
      this.logger.log(`[kick] 로비에서 강퇴를 시도함`);
      throw new WsException('로비에서는 강퇴할 수 없습니다.');
    }

    if (targetUserName === userName) {
      this.logger.log(`[kick] 자기 자신을 강퇴하려 함`);
      throw new WsException('자기 자신을 강퇴할 수 없습니다.');
    }

    if (!this.isChief(roomId, userName)) {
      this.logger.log(`[kick] 방장이 아닌 사용자가 강퇴를 시도함`);
      throw new WsException('방장이 아닙니다.');
    }

    const room = this.roomList[roomId];

    room.userList = room.userList.filter(
      (user) => user.userName !== targetUserName,
    );
    room.banList.add(targetUserName);
  }

  invite(dto: RoomsInviteDto) {
    const { roomId, userName, targetUserName, targetUserRoomId } = dto;
    const { state, capacity, userList } = this.roomInfo(roomId);
    const userCount = userList.length;

    if (!this.socketId(targetUserName)) {
      this.logger.log(`[invite] 존재하지 않는 사용자를 초대함`);
      throw new WsException('존재하지 않는 사용자입니다.');
    }

    if (targetUserRoomId !== LOBBY_ID) {
      this.logger.log(
        `[invite] ${userName} 사용자가 로비에 없는 사용자를 초대함`,
      );
      throw new WsException('초대한 유저가 로비에 없습니다.');
    }

    if (roomId === LOBBY_ID) {
      this.logger.log(`[invite] ${userName} 사용자가 로비에서 초대를 시도함`);
      throw new WsException('로비에서는 초대할 수 없습니다.');
    }

    if (state !== ROOM_STATE.WAITING) {
      this.logger.log(
        `[invite] ${userName} 사용자가 이미 게임이 시작된 방에 초대를 시도함`,
      );
      throw new WsException('이미 게임이 시작된 방에는 초대할 수 없습니다.');
    }

    if (userCount >= capacity) {
      this.logger.log(`[invite] ${userName} 사용자가 꽉 찬 방에 초대를 시도함`);
      throw new WsException('꽉 찬 방에는 초대할 수 없습니다.');
    }
  }

  roomExists(roomId: string) {
    return !!this.roomList[roomId];
  }

  private allGameRoom(): Room[] {
    return Object.values(this.roomList).filter(
      (room) => room.roomId !== LOBBY_ID,
    );
  }

  private isChief(roomId: string, userName: string) {
    return this.roomList[roomId].userList[0].userName === userName;
  }

  private randomItem(): ItemList {
    const item = Math.floor(Math.random() * NUM_OF_ITEMS);

    return item;
  }
}
