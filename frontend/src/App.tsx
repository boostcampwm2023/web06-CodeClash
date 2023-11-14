import Button from "./components/common/Button";

const App: React.FC = () => {
  return (
    <div className="bg-defaultPattern h-[100vh] w-[100vw]">
      <Button color="pink" title="READY!" subTitle="난투 시작"></Button>
    </div>
  );
};

export default App;
