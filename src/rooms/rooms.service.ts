import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';
import {
  CreateRoomInfo,
  Room,
  RoomInfo,
  RoomList,
} from './entities/room.entity';

@Injectable()
export class RoomsService {
  private roomList: RoomList = {
    lobby: {
      roomId: 'lobby',
      roomName: '로비',
      userList: [],
      capacity: 1000,
      state: 'waiting',
    } as Room,
  };

  private userNameSocketMapper = new Map();

  constructor() {}

  createRoom(
    client: Socket,
    roomName: string,
    capacity: number,
  ): CreateRoomInfo {
    const roomId = uuid();

    this.exitRoom(client, 'lobby');

    this.roomList[roomId] = {
      roomId,
      roomName,
      userList: [],
      capacity,
      state: 'waiting',
    };

    this.enterRoom(client, roomId);

    return {
      roomId,
      roomName,
      capacity,
    };
  }

  enterRoom(client: Socket, roomId: string) {
    client.join(roomId);
    client.data.roomId = roomId;
    this.roomList[roomId].userList.push(client);
  }

  exitRoom(client: Socket, roomId: string) {
    client.leave(roomId);
    this.deleteUserFromList(client, roomId);
  }

  getGameRoom(roomId: string): RoomInfo {
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
    client.data.user.ready = !client.data.user.ready;

    return client.data.user.ready;
  }

  checkUsersReady(roomId: string) {
    return this.roomList[roomId].userList.every((user) => user.data.user.ready);
  }

  getAllClient(roomId: string) {
    return this.roomList[roomId].userList.map((user) => user.data.user.name);
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
}
