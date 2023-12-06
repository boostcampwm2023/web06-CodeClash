import { useNavigate } from "react-router-dom";
import Button from "../common/Button";

const ResultButtonBox: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button color="yellow" title="다시하기" subTitle="REVENGE!" onClick={() => navigate("/room")} />
      <Button color="pink" title="나가기" subTitle="RUN!" onClick={() => navigate("/lobby")} />
    </div>
  );
};

export default ResultButtonBox;
