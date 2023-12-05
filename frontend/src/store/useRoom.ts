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
  userList: UserInfo[];
  problemList: ProblemType[];
}

interface RoomAction {
  setRoomInfo: (newRoomInfo: RoomState) => void;
  setRoomUserList: (newUserList: UserInfo[]) => void;
  setAddRoomUser: (newUser: UserInfo) => void;
  setRemoveRoomUser: (userName: string) => void;
  setChangeUserReady: (userName: string, ready: boolean) => void;
  setProblemList: (problemList: ProblemType[]) => void;
}

interface RoomStore extends RoomState, RoomAction {}

export const useRoomStore = create<RoomStore>(set => ({
  roomId: "",
  roomName: "",
  capacity: 0,
  userList: [],
  problemList: [],
  setRoomInfo: newRoomInfo => set(state => ({ ...newRoomInfo })),
  setRoomUserList: userList => set(state => ({ userList })),
  setAddRoomUser: newUser => set(state => ({ userList: state.userList.concat(newUser) })),
  setRemoveRoomUser: exitedUserName =>
    set(state => ({ userList: state.userList.filter(({ userName }) => userName !== exitedUserName) })),
  setChangeUserReady: (userName, ready) =>
    set(state => ({
      userList: state.userList.map(user => (user.userName === userName ? { ...user, ready } : user)),
    })),
  setProblemList: problemList => set(state => ({ problemList })),
}));