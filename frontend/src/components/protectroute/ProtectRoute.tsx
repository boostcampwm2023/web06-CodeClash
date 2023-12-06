import { Navigate, Outlet, useLocation, useNavigate } from "react-router";
import { useLoginStore } from "../../store/useLogin";
import { useEffect } from "react";
import { useRoomStore } from "../../store/useRoom";

interface ProtectRouteProps {
  isNeedLogin?: boolean;
  to: string;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ isNeedLogin = true, to }) => {
  const { isLogin } = useLoginStore();
  const currentLocation = useLocation();
  const { roomId } = useRoomStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      if (!roomId && currentLocation.pathname !== "/lobby") {
        navigate("/lobby");
      }
    }
  }, [roomId]);

  useEffect(() => {
    const preventClose = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    if (process.env.NODE_ENV === "production") {
      window.addEventListener("beforeunload", preventClose);
    }
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
