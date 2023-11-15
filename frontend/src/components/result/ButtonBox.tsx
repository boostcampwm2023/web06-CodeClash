import Button from "../common/Button";

const ButtonBox: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button color="yellow" title="다시하기" subTitle="REVENGE!" />
      <Button color="pink" title="나가기" subTitle="RUN!" />
    </div>
  );
};

export default ButtonBox;
