import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import ReadyPage from "./pages/ReadyPage";
import GamePlayPage from "./pages/GamePlayPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import ProtectRoute from "./components/protectroute/ProtectRoute";
import SocketProvider from "./components/SocketProvider";

const App: React.FC = () => {
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw] min-w-[1180px]">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectRoute to="/login" />}>
            <Route element={<SocketProvider />}>
              <Route path="/lobby" element={<LobbyPage />} />
              <Route path="/room" element={<ReadyPage />} />
              <Route path="/game" element={<GamePlayPage />} />
              <Route path="/result" element={<ResultPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
