import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import RoomPage from "./pages/RoomPage";
import GamePlayPage from "./pages/GamePlayPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import ProtectRoute from "./components/protectroute/ProtectRoute";
import SocketProvider from "./components/SocketProvider";
import MusicPlayer from "./components/player/MusicPlayer";
import { AnimatePresence } from "framer-motion";

const App: React.FC = () => {
  const location = useLocation();
  return (
    <div className="bg-defaultPattern bg-cover w-screen h-screen">
      <MusicPlayer />
      <AnimatePresence initial={false} mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectRoute to="/login" />}>
            <Route element={<SocketProvider />}>
              <Route path="/lobby" element={<LobbyPage />} />
              <Route path="/room" element={<RoomPage />} />
              <Route path="/game" element={<GamePlayPage />} />
              <Route path="/result" element={<ResultPage />} />
            </Route>
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
