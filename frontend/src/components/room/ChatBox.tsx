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
    if (!chatMessage) return;
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
            onKeyUp={e => e.key === "Enter" && handleSendChat()}
          ></input>
          <button className="absolute right-2 bottom-[3px] h-full" onClick={handleSendChat}>
            <svg xmlns="http://www.w3.org/2000/svg" height="2em" viewBox="0 0 512 512">
              <path d="M352 96l64 0c17.7 0 32 14.3 32 32l0 256c0 17.7-14.3 32-32 32l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l64 0c53 0 96-43 96-96l0-256c0-53-43-96-96-96l-64 0c-17.7 0-32 14.3-32 32s14.3 32 32 32zm-9.4 182.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L242.7 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomChatBox;
