import { ChangeEvent, useRef, useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useSocketStore } from "../../store/useSocket";
import { GameRoom } from "../../store/useLobby";
import { UserInfo, useRoomStore } from "../../store/useRoom";
import { useNavigate } from "react-router";

interface CreateRoomModalProps {
  closeModal: () => void;
}

interface IUserCreateRoomResponse extends GameRoom {
  userName: string;
}

export interface ICreateRoomResponse extends GameRoom {
  status: "success" | "error";
  userList: UserInfo[];
}

const DEFAULT_CAPACITY = "4";
const CAPACITY_LENGTH = 5;
const CAPACITY_MIN_VALUE = 2;

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ closeModal }) => {
  const { socket } = useSocketStore();
  const { setRoomId } = useRoomStore();
  const [selectedRadio, setSelectedRadio] = useState(DEFAULT_CAPACITY);

  const navigate = useNavigate();
  const createRoomInput = useRef({
    roomName: "",
    capacity: DEFAULT_CAPACITY,
  });

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    createRoomInput.current.capacity = value;
  };

  const handleEnterRoomEvent = ({ status, message }: { status: string; message: string }) => {
    if (status === "error") {
      alert(message);
      navigate("/lobby");
    }
    if (status === "success") {
      navigate("/room");
    }
  };

  const handleRoomCreated = ({ status, roomId }: ICreateRoomResponse) => {
    if (status === "success") {
      setRoomId(roomId);
      socket?.emit("enter_room", { roomId }, handleEnterRoomEvent);
    }
  };

  const handleCreateRoom = () => {
    if (!socket) return;
    socket.emit("create_room", createRoomInput.current, handleRoomCreated);
    closeModal();
  };

  const capacityInput = Array(CAPACITY_LENGTH)
    .fill(CAPACITY_MIN_VALUE)
    .map((initValue, index) => {
      const id = String(initValue + index);
      return (
        <div key={index}>
          <input
            className="invisible"
            type="radio"
            id={id}
            name="capacity"
            value={id}
            onChange={() => handleRadioChange(id)}
          />
          <label className="cursor-pointer" style={{ color: selectedRadio === id ? "black" : "white" }} htmlFor={id}>
            {id}
          </label>
        </div>
      );
    });

  return (
    <Modal title="방 생성하기" closeModal={closeModal} className="px-2 flex flex-col items-center gap-2">
      <input
        className="rounded py-1 px-2 text-black text-sm"
        placeholder="방 이름"
        onChange={(e: ChangeEvent<HTMLInputElement>) => (createRoomInput.current.roomName = e.target.value)}
        maxLength={20}
      />
      <div className="flex">
        제한 인원
        {capacityInput}
      </div>
      <Button onClick={handleCreateRoom} color="black" className="py-[10px]" title="생성" />
    </Modal>
  );
};

export default CreateRoomModal;
