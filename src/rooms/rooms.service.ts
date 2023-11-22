import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';

@Injectable()
export class RoomsService {
  private roomList = {
    lobby: {
      roomId: 'lobby',
      roomName: '로비',
      userList: [],
      capacity: 1000,
    },
  };

  private userNameSocketMapper = new Map();

  constructor() {}

  createRoom(client: Socket, roomName: string, capacity: number) {
    const roomId = uuid();

    this.exitRoom(client, 'lobby');

    this.roomList[roomId] = {
      roomId,
      roomName,
      userList: [],
      capacity,
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

  getGameRoom(roomId: string) {
    const room = this.roomList[roomId];

    return {
      roomId,
      roomName: room.roomName,
      capacity: room.capacity,
      userCount: room.userList.length,
    };
  }

  getAllGameRoom() {
    return Object.values(this.roomList).map((room) => {
      if (room.roomId !== 'lobby') {
        return {
          roomId: room.roomId,
          roomName: room.roomName,
          capacity: room.capacity,
          userCount: room.userList.length,
        };
      }
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
}
