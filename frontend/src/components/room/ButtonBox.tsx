import Button from "../common/Button";

interface RoomButtonBoxProps {
  exitRoom: () => void;
}

const RoomButtonBox: React.FC<RoomButtonBoxProps> = ({ exitRoom }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-full">
      <Button color="pink" title="READY!" subTitle="난투 시작" />
      <Button color="yellow" title="INVITE" subTitle="초대하기" />
      <Button onClick={exitRoom} color="skyblue" title="EXIT" subTitle="나가기" />
    </div>
  );
};

export default RoomButtonBox;
