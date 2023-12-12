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
import { createBrowserHistory } from "history";
import { useEffect } from "react";
const history = createBrowserHistory();
const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.log("useEffect");
    const unlisten = history.listen(his => {
      console.log(his);
      console.log(location);
      if (his.action === "POP") {
        history.push(location);
      }
    });
    return unlisten;
  }, [location]);
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
          <Route path="*" element={<Navigate to="/lobby" />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default App;
