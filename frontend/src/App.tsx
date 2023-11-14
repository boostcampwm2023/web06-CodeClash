import Button from "./components/common/Button";
import GamePlayPage from "./pages/GamePlayPage";
import LobyPage from "./pages/LobyPage";

const App: React.FC = () => {
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw]">
      <LobyPage />
    </div>
  );
};

export default App;
