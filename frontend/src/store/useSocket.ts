import { io, Socket } from "socket.io-client";
import { create } from "zustand";

const URL = "https://codeclash.site/rooms";

interface SocketState {
  socket: Socket | null;
}

interface SocketAction {
  setSocket: (token: string) => void;
}

interface SocketStore extends SocketState, SocketAction {}

const createSocket = (token: string) => {
  return io(URL, {
    extraHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const useSocketStore = create<SocketStore>(set => ({
  socket: null,
  setSocket: (token: string) => set(state => ({ socket: createSocket(token) })),
}));
