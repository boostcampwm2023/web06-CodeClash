import { useEffect, useState } from "react";
import Modal from "../common/Modal";
import { getUserInfo } from "../../api/user";
import { Editor, Monaco } from "@monaco-editor/react";
import { ProblemType } from "../gameplay/problemType";
import type monaco from "monaco-editor";

interface UserInfoModalProps {
  closeModal: () => void;
  userName: string;
}

interface ISubmission {
  language: string;
  code: string;
  status: string;
  problem: ProblemType;
}

interface IUserInfo {
  email: string;
  name: string;
  submissions: ISubmission[];
}

const editorOptions = {
  minimap: {
    enabled: false,
  },
  scrollbar: {
    verticalScrollbarSize: 0,
    horizontalScrollbarSize: 0,
  },
  fontFamily: "Cafe24Ssurround",
  readOnly: true,
  fontSize: 32,
};

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

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    import("../../assets/theme/EditorTheme.json").then(data => {
      monaco.editor.defineTheme("myTheme", data as monaco.editor.IStandaloneThemeData);
      monaco.editor.setTheme("myTheme");
    });
  };

  return (
    <Modal
      title={`${userName}님의 정보`}
      closeModal={closeModal}
      className="px-2 w-[40rem] h-[20rem] flex flex-col items-center gap-2"
    >
      {userInfo ? (
        <div className="w-full h-full">
          <div className="p-2 flex justify-between">
            <div>EMAIL : {userInfo.email}</div>
            <div>
              {userInfo.submissions.map((submission, index) => (
                <button
                  style={{ color: submissionIndex === index ? "black" : "white" }}
                  key={submission.problem.title}
                  onClick={() => setSubmissionIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-lightskyblue w-full h-[85%] p-2 rounded-lg overflow-scroll">
            {userInfo.submissions.length > 0 ? (
              <Editor
                language="javascript"
                value={
                  "// " +
                  userInfo.submissions[submissionIndex].problem.title +
                  "\n" +
                  userInfo.submissions[submissionIndex].code
                }
                onMount={handleEditorDidMount}
                options={{ ...editorOptions }}
              />
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
