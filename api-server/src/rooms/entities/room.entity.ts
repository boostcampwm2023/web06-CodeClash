import { Socket } from 'socket.io';
import { RoomsUser } from './rooms.user.entity';

export interface Room {
  roomId: string;
  roomName: string;
  userList: RoomsUser[];
  capacity: number;
  state: 'waiting' | 'playing';
  timer: NodeJS.Timeout | null;
  itemCreater: NodeJS.Timeout | null;
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
  userList: User[];
  state: 'waiting' | 'playing';
}

export interface User {
  userName: string;
  ready: boolean;
  itemList?: Record<string, number>;
}
