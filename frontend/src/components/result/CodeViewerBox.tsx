import { useState } from "react";
import Button from "../common/Button";
import GameDefaultBox from "../gameplay/DefaultBox";

interface ICodeContent {
  title: string;
  code: string;
}

const tempCodeList = [
  {
    title: "두 수의 합",
    code: "console.log(a + b);",
  },
  {
    title: "최단거리",
    code: "console.log(a - b);",
  },
  {
    title: "정렬하기",
    code: "console.log(a * b);",
  },
];

const CodeViewerBox: React.FC = () => {
  const [codeList, setCodeList] = useState<ICodeContent[]>(tempCodeList);
  // const [codeList, setCodeList] = useState<ICodeContent[]>([]);
  const [tabIndex, setTabIndex] = useState(0);

  const handleClickTitleButton = (index: number) => {
    setTabIndex(index);
  };

  const titles = codeList.map(({ title }, index) => (
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
      <GameDefaultBox className="w-full min-h-[633px] rounded-tl-none text-[0.5rem]">
        {codeList.length > tabIndex ? codeList[tabIndex].code : ""}
      </GameDefaultBox>
    </div>
  );
};

export default CodeViewerBox;
