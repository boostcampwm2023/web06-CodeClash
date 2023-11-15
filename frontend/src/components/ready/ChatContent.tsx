interface ChatContentProps {
  username: string;
  createdAt: string;
  content: string;
}

const ChatContent: React.FC<ChatContentProps> = ({ username, createdAt, content }) => {
  return (
    <div className="flex relative mt-4 mb-1 mx-2 p-2 border rounded-xl border-white">
      <div className="w-full flex absolute top-[-16px]">
        <div className="absolute left-0 bg-yellow rounded-md px-3 leading-4">{username}</div>
        <div className="absolute right-5 bg-gray-500 rounded-md px-2 leading-4">{createdAt}</div>
      </div>
      <div className="mt-2 text-start">{content}</div>
    </div>
  );
};

export default ChatContent;
