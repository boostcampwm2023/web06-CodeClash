import { useEffect, useRef, useState } from "react";
import { postLoginRequest, postRegisterRequest } from "../../api/auth";
import { useLoginStore } from "../../store/useLogin";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const LoginInputBox: React.FC = () => {
  const { isLogin, setLoginInitial: setLogin } = useLoginStore();
  const [isModalOpened, setModalOpened] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isLogin) {
        e.preventDefault();
        e.stopPropagation();
        navigate("/lobby");
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLogin]);

  const userLoginInput = useRef({
    email: "",
    password: "",
  });

  const userRegisterInput = useRef({
    name: "",
    email: "",
    password: "",
  });

  const infoInput = (ref: any) => {
    return (
      <>
        <label className="text-white " htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          className="rounded-full border-[3px] border-white text-[0.75rem] py-1 px-2 outline-none bg-[#D9D9D9] max-w-[calc(100vw-2rem)] w-[15rem] min-w-[45vh]"
          onChange={e => (ref.current.email = e.target.value)}
        ></input>
        <label className="text-white " htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          className="rounded-full border-[3px] border-white text-[0.75rem] p-1 px-2 outline-none bg-[#D9D9D9] max-w-[calc(100vw-2rem)] w-[15rem] min-w-[45vh]"
          onChange={e => (ref.current.password = e.target.value)}
          type="password"
          onKeyDown={e => {
            if (e.key === "Enter") handleLogin(userLoginInput.current);
          }}
        ></input>
      </>
    );
  };

  const handleSignup = ({ name, email, password }: { name: string; email: string; password: string }) => {
    postRegisterRequest(name, email, password)
      .then(res => {
        const { accessToken } = res;
        setLogin(email, name, accessToken);
        navigate("/lobby");
      })
      .catch(err => {
        alert(err?.response?.data?.message ?? "회원가입에 실패했습니다.");
      });
  };

  const handleLogin = ({ email, password }: { email: string; password: string }) => {
    postLoginRequest(email, password)
      .then(res => {
        const { userName, accessToken } = res.data;
        setLogin(email, userName, accessToken);
        navigate("/lobby");
      })
      .catch(err => {
        alert("아이디/비밀번호를 확인해주세요.");
      });
  };

  return (
    <>
      {!isLogin ? (
        <div className="flex flex-col items-start">
          {infoInput(userLoginInput)}
          <button className="self-center text-white text-[0.75rem]" onClick={() => setModalOpened(true)}>
            회원가입
          </button>
          {isModalOpened && (
            <Modal title="회원가입" closeModal={() => setModalOpened(false)}>
              <div className="flex flex-col items-start">
                <label className="text-white " htmlFor="name">
                  닉네임
                </label>
                <input
                  id="name"
                  className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem]"
                  onChange={e => (userRegisterInput.current.name = e.target.value)}
                ></input>
                {infoInput(userRegisterInput)}
                <Button
                  color="pink"
                  title="회원가입"
                  className="self-center text-[0.75rem]"
                  onClick={() => handleSignup(userRegisterInput.current)}
                ></Button>
              </div>
            </Modal>
          )}

          <button
            className=" text-center w-full rounded-full bg-pink text-[0.75rem] text-white py-1"
            onClick={() => {
              handleLogin(userLoginInput.current);
            }}
          >
            로그인
          </button>
        </div>
      ) : (
        <div className="text-white">Press Any Key To Start</div>
      )}
    </>
  );
};

export default LoginInputBox;
