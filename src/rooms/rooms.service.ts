import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { Socket } from 'socket.io';

@Injectable()
export class RoomsService {
  roomList = {
    lobby: {
      roomId: 'lobby',
      roomName: '로비',
      userList: [],
    },
  };

  constructor() {}

  createRoom(client: Socket, roomName: string, capacity: number) {
    const roomId = uuid();

    client.rooms.clear();
    client.join(roomId);
    this.roomList[roomId] = {
      roomId,
      roomName,
      userList: [client],
      capacity,
    };
  }

  enterRoom(client: Socket, roomId: string) {
    client.rooms.clear();
    client.join(roomId);

    this.roomList.lobby.userList = this.roomList.lobby.userList.filter(
      (user) => user.id !== client.id,
    );

    this.roomList[roomId].userList.push(client);
  }

  exitRoom(client: Socket, roomId: string) {
    client.rooms.clear();
    this.roomList[roomId].userList = this.roomList[roomId].userList.filter(
      (userId) => userId !== client.id,
    );

    if (this.roomList[roomId].userList.length === 0) {
      delete this.roomList[roomId];
    }

    client.join('lobby');
    this.roomList.lobby.userList.push(client.id);
  }

  exitLobby(client: Socket) {
    client.to('lobby_exit');

    this.roomList.lobby.userList = this.roomList.lobby.userList.filter(
      (user) => user.id !== client.id,
    );
  }

  getGameRoom(roomId: string) {
    return this.roomList[roomId];
  }

  getAllGameRoom() {
    return Object.values(this.roomList).filter((room) => {
      if (room.roomId !== 'lobby') {
        return {
          roomId: room.roomId,
          roomName: room.roomName,
          userCount: room.userList.length,
        };
      }
    });
  }

  getAllClient(roomId: string) {
    return this.roomList[roomId].userList.map((Socket) => Socket.user.name);
  }
}
