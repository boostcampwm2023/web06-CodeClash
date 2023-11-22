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
