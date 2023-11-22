import { Socket } from 'socket.io';

export interface Room {
  roomId: string;
  roomName: string;
  userList: Socket[];
  capacity: number;
  state: 'waiting' | 'playing';
}

export interface RoomList {
  [key: string]: Room;
}

export interface RoomInfo {
  roomId: string;
  roomName: string;
  capacity: number;
  userCount: number;
  state: 'waiting' | 'playing';
}

export interface CreateRoomInfo {
  roomId: string;
  roomName: string;
  capacity: number;
  userList: string[];
  state: 'waiting' | 'playing';
}
