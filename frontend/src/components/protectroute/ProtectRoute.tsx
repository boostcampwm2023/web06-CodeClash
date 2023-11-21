import { Navigate, Outlet, useLocation } from "react-router";
import { useLoginStore } from "../../store/useLogin";
import { useSocketStore } from "../../store/useSocket";
import { useEffect } from "react";

interface ProtectRouteProps {
  isNeedLogin?: boolean;
  to: string;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ isNeedLogin = true, to }) => {
  const { isLogin, accessToken } = useLoginStore();
  const { socket, setSocket } = useSocketStore();
  const currentLocation = useLocation();

  useEffect(() => {
    if (accessToken && !socket?.connected) {
      setSocket(accessToken);
    }
  }, [accessToken]);

  return isLogin === isNeedLogin ? (
    <Outlet />
  ) : (
    <Navigate to={to} replace state={{ redirectedFrom: currentLocation }} />
  );
};

export default ProtectRoute;
