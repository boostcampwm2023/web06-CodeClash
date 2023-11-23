import { useEffect } from "react";
import { useSocketStore } from "../store/useSocket";
import { Outlet } from "react-router";
import { useLoginStore } from "../store/useLogin";

const SocketProvider: React.FC = () => {
  const { socket, setSocket } = useSocketStore();
  const { accessToken } = useLoginStore();

  useEffect(() => {
    if (accessToken && !socket?.connected) {
      setSocket(accessToken);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.connect();
  }, [socket]);

  return <Outlet />;
};

export default SocketProvider;
