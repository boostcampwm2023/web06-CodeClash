import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { getUserInfo } from "../../api/user";

interface UserInfoModalProps {
  closeModal: () => void;
  userName: string;
}

interface ISubmission {
  language: string;
  code: string;
  status: string;
}

interface IUserInfo {
  email: string;
  name: string;
  submissions: ISubmission[];
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ closeModal, userName }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [submissionIndex, setSubmissionIndex] = useState(0);

  useEffect(() => {
    getUserInfo(userName).then(data => {
      if (data) {
        setUserInfo(data);
      }
    });
  }, []);

  return (
    <Modal
      title={`${userName}님의 정보`}
      closeModal={closeModal}
      className="px-2 w-[40rem] h-[20rem] flex flex-col items-center gap-2"
    >
      {userInfo ? (
        <div className="w-full h-full">
          <div>EMAIL : {userInfo.email}</div>
          <div className="bg-lightskyblue w-full h-[90%] p-2 rounded-lg">
            {userInfo.submissions.length > 0 ? (
              <div>
                <div>// {userInfo.submissions[submissionIndex].language}</div>
                <div>
                  {userInfo.submissions[submissionIndex].code.split("\n").map(e => (
                    <p>{e.replaceAll("  ", "　")}</p>
                  ))}
                </div>
              </div>
            ) : (
              `${userName}님의 코드 제출 기록이 없습니다`
            )}
          </div>
        </div>
      ) : (
        <div>{userName}님의 정보를 찾을 수 없습니다</div>
      )}
    </Modal>
  );
};

export default UserInfoModal;
