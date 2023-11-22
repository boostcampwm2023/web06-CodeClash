import { ChangeEvent, useRef, useState } from "react";
import Button from "../common/Button";
import Modal from "../common/Modal";
import { useSocketStore } from "../../store/useSocket";

interface CreateRoomModalProps {
  closeModal: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ closeModal }) => {
  const { socket } = useSocketStore();
  const [selectedRadio, setSelectedRadio] = useState("4");
  const createRoomInput = useRef({
    roomName: "",
    capacity: "4",
  });

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    createRoomInput.current.capacity = value;
  };

  const handleCreateRoom = () => {
    if (!socket) return;
    socket.emit("create_room", createRoomInput.current);
    // TODO: Navigate to room
  };

  const capacityInput = Array(5)
    .fill(2)
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
    <Modal title="초대 리스트" closeModal={closeModal} className="px-2 flex flex-col items-center gap-2">
      <input
        className="rounded py-1 px-2 text-black text-sm"
        placeholder="방 이름"
        onChange={(e: ChangeEvent<HTMLInputElement>) => (createRoomInput.current.roomName = e.target.value)}
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
