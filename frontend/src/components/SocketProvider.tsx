import { useEffect } from "react";
import { useSocketStore } from "../store/useSocket";
import { Outlet } from "react-router";

const SocketProvider: React.FC = () => {
  const { socket } = useSocketStore();

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  return <Outlet />;
};

export default SocketProvider;
