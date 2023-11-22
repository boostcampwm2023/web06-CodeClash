import { useState, useEffect, useRef } from "react";
import ReadyChatContent from "./ChatContent";

interface IChatMessage {
  username: string;
  createdAt: string;
  content: string;
}

const ReadyChatBox: React.FC = () => {
  const [chatList, setChatList] = useState<IChatMessage[]>([]);
  const chatScroll = useRef<HTMLDivElement>(null);

  const chatContents = chatList.map(({ username, createdAt, content }, index) => {
    return <ReadyChatContent username={username} createdAt={createdAt} content={content} key={username + index} />;
  });

  useEffect(() => {
    if (chatScroll.current) {
      chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
    }
  }, []);

  return (
    <div className="flex flex-col text-center w-full border-8 border-white rounded-lg bg-skyblue text-white">
      <div className="py-1">채팅창</div>
      <div className="bg-black text-[0.5rem] flex flex-col rounded-b-md">
        <div className="h-[518px] overflow-scroll" ref={chatScroll}>
          {chatContents}
        </div>
        <div className="flex flex-col relative">
          <input
            className="bg-gray-500 m-1 px-3 p-1 mb-2 rounded-md box-content"
            placeholder="내용을 입력하세요"
          ></input>
          <button className="absolute right-2 bottom-3">{"->"}</button>
        </div>
      </div>
    </div>
  );
};

export default ReadyChatBox;
