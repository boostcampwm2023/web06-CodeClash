import { create } from "zustand";
import { UserInfo } from "./useRoom";

export interface GameRoom {
  roomId: string;
  roomName: string;
  capacity: number;
  userCount: number;
  state: "playing" | "waiting";
}

export interface Invite {
  roomId: string;
  roomName: string;
  userName: string;
}

export interface LobbyState {
  userList: UserInfo[];
  gameRoomList: GameRoom[];
  inviteList: Invite[];
}

interface LobbyAction {
  setLobby: (lobbyInfo: LobbyState) => void;
  setAddLobbyUser: (userName: string) => void;
  setRemoveLobbyUser: (userName: string) => void;
  setAddGameRoom: (gameRoom: GameRoom) => void;
  setRemoveGameRoom: (roomId: string) => void;
  setRoomState: (roomId: string, state: "playing" | "waiting") => void;
  setRoomUserCount: (roomId: string, userCount: number) => void;
  setAddInvite: (invite: Invite) => void;
  setRemoveInvite: (roomId: string) => void;
}

interface LobbyStore extends LobbyState, LobbyAction {}

export const useLobbyStore = create<LobbyStore>(set => ({
  userList: [],
  gameRoomList: [],
  inviteList: [],
  setLobby: lobbyInfo => set(state => lobbyInfo),
  setAddLobbyUser: userName => set(state => ({ userList: state.userList.concat({ userName }) })),
  setRemoveLobbyUser: exitedUserName =>
    set(state => ({ userList: state.userList.filter(({ userName }) => userName !== exitedUserName) })),
  setAddGameRoom: gameRoom => set(state => ({ gameRoomList: state.gameRoomList.concat(gameRoom) })),
  setRemoveGameRoom: targetRoomId =>
    set(state => ({ gameRoomList: state.gameRoomList.filter(({ roomId }) => roomId !== targetRoomId) })),
  setRoomState: (targetRoomId, targetState) => {
    set(state => ({
      gameRoomList: state.gameRoomList.map(gameRoom => {
        if (gameRoom.roomId === targetRoomId) {
          return { ...gameRoom, state: targetState };
        }
        return gameRoom;
      }),
    }));
  },
  setRoomUserCount: (roomId, userCount) =>
    set(state => ({
      gameRoomList: state.gameRoomList.map(gameRoom =>
        gameRoom.roomId === roomId ? { ...gameRoom, userCount } : gameRoom,
      ),
    })),
  setAddInvite: invite =>
    set(state => ({
      inviteList: state.inviteList.filter(({ roomId }) => roomId !== invite.roomId).concat(invite),
    })),
  setRemoveInvite: targetRoomId =>
    set(state => ({
      inviteList: state.inviteList.filter(({ roomId }) => roomId !== targetRoomId),
    })),
}));
