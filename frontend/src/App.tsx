import { BrowserRouter, Route, Routes } from "react-router-dom";
import LobbyPage from "./pages/LobyPage";
import ReadyPage from "./pages/ReadyPage";
import GamePlayPage from "./pages/GamePlayPage";

const App: React.FC = () => {
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw]">
      <BrowserRouter>
        <Routes>
          <Route path="/lobby" element={<LobbyPage />} />
          <Route path="/room" element={<ReadyPage />} />
          <Route path="/game" element={<GamePlayPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;