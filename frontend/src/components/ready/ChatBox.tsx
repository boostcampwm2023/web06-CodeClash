import { useState, useEffect, useRef } from "react";
import ChatContent from "./ChatContent";

interface IChatMessage {
  username: string;
  createdAt: string;
  content: string;
}

const tempChatMessageList = [
  {
    username: "유저A",
    createdAt: "오후 17:00",
    content: "glhf",
  },
  {
    username: "유저B",
    createdAt: "오후 17:01",
    content: "아무리 긴 글을 쳐도 괜찮게 나오도록 할 수 있도록 하는 것이 목표입니다.",
  },
  {
    username: "유저C",
    createdAt: "오후 17:02",
    content: "오버플로우가 발생해도 알아서 잘 안보이게 해주세요.",
  },
  {
    username: "유저D",
    createdAt: "오후 17:03",
    content: "새로 챗을 쳤을 때 하단 고정하는 것은 api 추가할 때 하죠.",
  },
  {
    username: "유저E",
    createdAt: "오후 17:04",
    content: "이쯤 되면 넘칠 때도 되었지?",
  },
  {
    username: "유저F",
    createdAt: "오후 17:05",
    content: "이제 진짜 마지막 챗",
  },
];

const ChatBox: React.FC = () => {
  const [chatList, setChatList] = useState<IChatMessage[]>(tempChatMessageList);
  // const [chatList, setChatList] = useState<IChatMessage[]>([]);
  const chatScroll = useRef<HTMLDivElement>(null);

  const chatContents = chatList.map(({ username, createdAt, content }, index) => {
    return <ChatContent username={username} createdAt={createdAt} content={content} key={username + index} />;
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

export default ChatBox;
