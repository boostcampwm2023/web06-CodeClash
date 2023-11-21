import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { baseURL } from "../api/baseAxios";

interface SocketState {
  socket?: Socket;
}

interface SocketAction {
  setSocket: (token: string) => void;
}

interface SocketStore extends SocketState, SocketAction {}

const createSocket = (token: string) => {
  return io(baseURL + "/rooms", {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useSocketStore = create<SocketStore>(set => ({
  setSocket: (token: string) => set(state => ({ socket: createSocket(token) })),
}));
