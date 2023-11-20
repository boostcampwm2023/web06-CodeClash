import { BrowserRouter, Route, Routes } from "react-router-dom";
import LobbyPage from "./pages/LobbyPage";
import ReadyPage from "./pages/ReadyPage";
import GamePlayPage from "./pages/GamePlayPage";
import LoginPage from "./pages/LoginPage";
import Provider from "./components/Provider";

const App: React.FC = () => {
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw] min-w-[1180px]">
      <BrowserRouter>
        <Provider>
          <Routes>
            <Route path="/lobby" element={<LobbyPage />} />
            <Route path="/room" element={<ReadyPage />} />
            <Route path="/game" element={<GamePlayPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </div>
  );
};

export default App;
