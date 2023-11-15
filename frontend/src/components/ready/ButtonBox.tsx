import Button from "../common/Button";

const ButtonBox: React.FC = () => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <Button color="pink" title="READY!" subTitle="난투 시작" />
      <Button color="yellow" title="INVITE" subTitle="초대하기" />
      <Button color="skyblue" title="EXIT" subTitle="나가기" />
    </div>
  );
};

export default ButtonBox;
