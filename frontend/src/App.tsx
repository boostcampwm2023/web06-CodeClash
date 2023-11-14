import Button from "./components/common/Button";
import GamePlayPage from "./pages/GamePlayPage";

const App: React.FC = () => {
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw]">
      <GamePlayPage />
    </div>
  );
};

export default App;
