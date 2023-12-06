import { RoomsUser } from './rooms.user.entity';
import { RoomState } from '../rooms.constants';

export interface Room {
  roomId: string;
  roomName: string;
  userList: RoomsUser[];
  capacity: number;
  state: RoomState;
  timer: NodeJS.Timeout | null;
  itemCreator: NodeJS.Timeout | null;
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
