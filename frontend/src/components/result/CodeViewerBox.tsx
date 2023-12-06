import { useEffect, useState } from "react";
import Button from "../common/Button";
import GameDefaultBox from "../gameplay/DefaultBox";

interface CodeViewerBoxProps {
  codeList: {
    title: string;
    code: string;
  }[];
}

const CodeViewerBox: React.FC<CodeViewerBoxProps> = ({ codeList }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const handleClickTitleButton = (index: number) => {
    setTabIndex(index);
  };

  const titles = codeList?.map(({ title }, index) => (
    <Button
      onClick={() => handleClickTitleButton(index)}
      color="skyblue"
      title={title}
      className={`rounded-b-none border-b-0 text-sm ${index !== tabIndex ? "opacity-80" : ""}`}
      key={title}
    />
  ));

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex">{titles}</div>
      <GameDefaultBox className="w-full rounded-tl-none text-[0.5rem]">
        {codeList?.length > tabIndex ? codeList[tabIndex].code : ""}
      </GameDefaultBox>
    </div>
  );
};

export default CodeViewerBox;
