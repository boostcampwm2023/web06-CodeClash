import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

const ResultButtonBox: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      <Button
        className="w-full"
        color="yellow"
        title="다시하기"
        subTitle="REVENGE!"
        onClick={() => navigate("/room")}
      />
    </div>
  );
};

export default ResultButtonBox;
