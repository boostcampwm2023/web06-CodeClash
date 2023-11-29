import { create } from "zustand";

export interface UserInfo {
  isHost?: boolean;
  userName: string;
  ready?: boolean;
}

export interface RoomInfo {
  roomId: string;
  roomName: string;
  capacity: number;
  userList: UserInfo[];
}

interface RoomState {
  roomInfo: RoomInfo;
}

interface RoomAction {
  setRoomInfo: (newRoomInfo: RoomInfo) => void;
  setUserList: (newUserList: UserInfo[]) => void;
}

interface RoomStore extends RoomState, RoomAction {}

export const useRoomStore = create<RoomStore>(set => ({
  roomInfo: {
    roomId: "",
    roomName: "",
    capacity: 0,
    userList: [],
  },
  setRoomInfo: newRoomInfo => set(state => ({ roomInfo: newRoomInfo })),
  setUserList: userList => set(state => ({ roomInfo: { ...state.roomInfo, userList } })),
}));
