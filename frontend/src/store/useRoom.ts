import { create } from "zustand";
import { ProblemType } from "../components/gameplay/problemType";

export interface UserInfo {
  userName: string;
  ready?: boolean;
}

interface RoomState {
  roomId: string;
  roomName: string;
  capacity: number;
  isStart: boolean;
  userList: UserInfo[];
  problemList: ProblemType[];
}

interface RoomAction {
  setRoomId: (newRoomId: string) => void;
  setRoomInfo: (newRoomInfo: RoomState) => void;
  clearRoomInfo: () => void;
  setIsStart: (isStart: boolean) => void;
  setRoomUserList: (newUserList: UserInfo[]) => void;
  setAddRoomUser: (newUser: UserInfo) => void;
  setRemoveRoomUser: (userName: string) => void;
  setChangeUserReady: (userName: string, ready: boolean) => void;
  setProblemList: (problemList: ProblemType[]) => void;
  setAllUserReady: (readyStatus: boolean) => void;
}

interface RoomStore extends RoomState, RoomAction {}

export const useRoomStore = create<RoomStore>(set => ({
  roomId: "",
  roomName: "",
  capacity: 0,
  isStart: false,
  userList: [],
  problemList: [],
  setRoomId: newRoomId => set(state => ({ roomId: newRoomId })),
  setRoomInfo: newRoomInfo => set(state => ({ ...newRoomInfo })),
  clearRoomInfo: () =>
    set(state => ({
      roomId: "",
      roomName: "",
      capacity: 0,
      isStart: false,
      userList: [],
      problemList: [],
    })),
  setIsStart: isStart => set(state => ({ isStart })),
  setRoomUserList: userList => set(state => ({ userList })),
  setAddRoomUser: newUser => set(state => ({ userList: state.userList.concat(newUser) })),
  setRemoveRoomUser: exitedUserName =>
    set(state => ({ userList: state.userList.filter(({ userName }) => userName !== exitedUserName) })),
  setChangeUserReady: (userName, ready) =>
    set(state => ({
      userList: state.userList.map(user => (user.userName === userName ? { ...user, ready } : user)),
    })),
  setProblemList: problemList => set(state => ({ problemList })),
  setAllUserReady: readyStatus =>
    set(state => ({ userList: state.userList.map(user => ({ ...user, ready: readyStatus })) })),
}));
