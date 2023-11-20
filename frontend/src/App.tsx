import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import ReadyPage from "./pages/ReadyPage";
import GamePlayPage from "./pages/GamePlayPage";
import ResultPage from "./pages/ResultPage";
import LoginPage from "./pages/LoginPage";
import Provider from "./components/Provider";
import { useLoginStore } from "./store/useLogin";
import ProtectRoute from "./components/protectroute/ProtectRoute";

const App: React.FC = () => {
  const { isLogin } = useLoginStore();
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw] min-w-[1180px]">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectRoute to="/login" />}>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/room" element={<ReadyPage />} />
            <Route path="/game" element={<GamePlayPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
