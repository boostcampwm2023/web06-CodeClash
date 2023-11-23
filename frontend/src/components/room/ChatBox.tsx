import { useState, useEffect, useRef, ChangeEvent } from "react";
import RoomChatContent from "./ChatContent";
import { useSocketStore } from "../../store/useSocket";

interface IChatMessage {
  userName: string;
  createdAt: string;
  message: string;
}

interface RoomChatBoxProps {
  roomId: string;
}

const RoomChatBox: React.FC<RoomChatBoxProps> = ({ roomId }) => {
  const [chatList, setChatList] = useState<IChatMessage[]>([]);
  const chatScroll = useRef<HTMLDivElement>(null);
  const { socket } = useSocketStore();
  const [chatMessage, setChatMessage] = useState("");

  const handleSendChat = () => {
    socket?.emit("chat", { roomId, message: chatMessage });
    setChatMessage("");
  };

  const handleReceiveChat = ({ userName, message }: IChatMessage) => {
    const date = new Date();
    setChatList(prev => prev.concat({ userName, message, createdAt: date.toLocaleTimeString() }));
  };

  const chatContents = chatList.map(({ userName, createdAt, message }, index) => {
    return <RoomChatContent userName={userName} createdAt={createdAt} content={message} key={userName + index} />;
  });

  useEffect(() => {
    if (chatScroll.current) {
      chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
    }
  }, [chatList]);

  useEffect(() => {
    if (socket) {
      socket.on("chat", handleReceiveChat);
    }
    return () => {
      if (socket) {
        socket.off("chat", handleReceiveChat);
      }
    };
  }, [socket]);

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
            value={chatMessage}
            onChange={e => setChatMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSendChat()}
          ></input>
          <button className="absolute right-2 bottom-3" onClick={handleSendChat}>
            {"->"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChatBox;
