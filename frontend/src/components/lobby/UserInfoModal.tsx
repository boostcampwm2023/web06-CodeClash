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
  acceptCount: number;
  failCount: number;
  winCount: number;
  totalCount: number;
  pageEnd: number;
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
  fontSize: 18,
};
const CODE_COUNT_PER_PAGE = 5;

const UserInfoModal: React.FC<UserInfoModalProps> = ({ closeModal, userName }) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>();
  const [submissionIndex, setSubmissionIndex] = useState(0);
  const [submissionPage, setSubmissionPage] = useState(0);

  useEffect(() => {
    getUserCodeByPage(0);
  }, []);

  const getUserCodeByPage = (page: number) => {
    return getUserInfo(userName, page).then(data => {
      if (data) {
        setUserInfo(data);
      }
    });
  };

  const handleNextCodePage = () => {
    getUserCodeByPage(submissionPage + 1).then(_ => {
      setSubmissionPage(submissionPage + 1);
      setSubmissionIndex(0);
    });
  };

  const handlePrevCodePage = () => {
    getUserCodeByPage(submissionPage - 1).then(_ => {
      setSubmissionPage(submissionPage - 1);
      setSubmissionIndex(CODE_COUNT_PER_PAGE - 1);
    });
  };

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    import("../../assets/theme/EditorTheme.json").then(data => {
      monaco.editor.defineTheme("myTheme", data as monaco.editor.IStandaloneThemeData);
      monaco.editor.setTheme("myTheme");
    });
  };

  const userInfoHeader = ({ email, acceptCount, failCount, winCount, totalCount, submissions }: IUserInfo) => (
    <div className="p-2 grid grid-cols-2">
      <div>전체 게임 수 : {totalCount.toLocaleString()}</div>
      <div>승리한 게임 수 : {winCount.toLocaleString()}</div>
      <div>코드 제출 횟수 : {(acceptCount + failCount).toLocaleString()}</div>
      <div>코드 통과 횟수 : {acceptCount.toLocaleString()}</div>
      <div>EMAIL : {email}</div>
    </div>
  );

  const userCode = ({ submissions }: IUserInfo) => (
    <>
      <div className="bg-lightskyblue flex flex-col justify-center items-center gap-2 p-2 rounded-lg overflow-scroll">
        <div>지난 제출 코드 보기</div>
        {submissions.length > 0 ? (
          <>
            <div className="h-[10rem]">
              <Editor
                language="javascript"
                value={`// Problem: ${submissions[submissionIndex].problem.title}\n\n${submissions[submissionIndex].code}`}
                onMount={handleEditorDidMount}
                options={{ ...editorOptions }}
              />
            </div>
            <div className="grid grid-cols-7 gap-2 justify-center">
              {submissionPage > 0 ? <button onClick={handlePrevCodePage}>{`<`}</button> : <button></button>}
              {submissions.map((submission, index) => (
                <button
                  style={{ color: submissionIndex === index ? "black" : "white" }}
                  key={submission.problem.title + String(index)}
                  onClick={() => setSubmissionIndex(index)}
                >
                  {submissionPage * CODE_COUNT_PER_PAGE + index + 1}
                </button>
              ))}
              {userInfo?.pageEnd && submissionPage < userInfo?.pageEnd ? (
                <button onClick={handleNextCodePage}>{`>`}</button>
              ) : (
                <button></button>
              )}
            </div>
          </>
        ) : (
          `${userName}님의 코드 제출 기록이 없습니다`
        )}
      </div>
    </>
  );

  return (
    <Modal
      title={`${userName}님의 정보`}
      closeModal={closeModal}
      className="px-2 w-[40rem] flex flex-col items-center gap-2"
    >
      {userInfo ? (
        <div className="w-full h-full">
          {userInfoHeader(userInfo)}
          {userCode(userInfo)}
        </div>
      ) : (
        <div>{userName}님의 정보를 찾을 수 없습니다</div>
      )}
    </Modal>
  );
};

export default UserInfoModal;
