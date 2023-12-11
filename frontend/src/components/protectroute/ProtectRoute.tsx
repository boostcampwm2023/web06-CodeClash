import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useLoginStore } from "../../store/useLogin";
import { useEffect } from "react";
import { useRoomStore } from "../../store/useRoom";
import preventBack from "./preventBack";

interface ProtectRouteProps {
  isNeedLogin?: boolean;
  to: string;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ isNeedLogin = true, to }) => {
  const { isLogin } = useLoginStore();
  const currentLocation = useLocation();
  const { roomId, userList } = useRoomStore();
  const navigate = useNavigate();
  preventBack();

  useEffect(() => {
    if (!roomId && currentLocation.pathname !== "/lobby") {
      navigate("/lobby");
    }
  }, [roomId]);

  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", preventClose);

    return () => {
      window.removeEventListener("beforeunload", preventClose);
    };
  }, []);

  return isLogin === isNeedLogin ? (
    <Outlet />
  ) : (
    <Navigate to={to} replace state={{ redirectedFrom: currentLocation }} />
  );
};

export default ProtectRoute;
