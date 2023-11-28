import { io, Socket } from "socket.io-client";
import { create } from "zustand";
import { baseURL } from "../api/baseAxios";

interface SocketState {
  socket?: Socket | null;
}

interface SocketAction {
  setSocket: (token: string) => void;
  setSocketClear: () => void;
}

interface SocketStore extends SocketState, SocketAction {}

const createSocket = (token: string) => {
  return io(baseURL + "/rooms", {
    path: "/api/rooms/",
    autoConnect: false,
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnection: true,
    transports: ["polling"],
  });
};

export const useSocketStore = create<SocketStore>(set => ({
  socket: null,
  setSocket: (token: string) => set(state => ({ socket: createSocket(token) })),
  setSocketClear: () => set(state => ({ socket: null })),
}));
