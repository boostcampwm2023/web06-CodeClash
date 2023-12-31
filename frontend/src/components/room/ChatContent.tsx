interface ChatContentProps {
  isNotification: boolean;
  userName: string;
  createdAt: string;
  content: string;
}

const RoomChatContent: React.FC<ChatContentProps> = ({ isNotification, userName, createdAt, content }) => {
  if (isNotification) {
    return (
      <p className="opacity-70">
        {userName}
        {content}
      </p>
    );
  }
  return (
    <div className="relative mt-4 mb-1 mx-2 p-2 border rounded-xl border-white">
      <div className="w-full absolute top-[-16px]">
        <div className="absolute left-0 bg-yellow rounded-md px-3 leading-4">{userName}</div>
        <div className="absolute right-5 bg-gray-500 rounded-md px-2 leading-4">{createdAt}</div>
      </div>
      <div className="mt-2 text-start">{content}</div>
    </div>
  );
};

export default RoomChatContent;
