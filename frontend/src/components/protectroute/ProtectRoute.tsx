import { Navigate, Outlet, useLocation } from "react-router";
import { useLoginStore } from "../../store/useLogin";

interface ProtectRouteProps {
  isNeedLogin?: boolean;
  to: string;
}

const ProtectRoute: React.FC<ProtectRouteProps> = ({ isNeedLogin = true, to }) => {
  const { isLogin } = useLoginStore();
  const currentLocation = useLocation();

  return isLogin === isNeedLogin ? (
    <Outlet />
  ) : (
    <Navigate to={to} replace state={{ redirectedFrom: currentLocation }} />
  );
};

export default ProtectRoute;
