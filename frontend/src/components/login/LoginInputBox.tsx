import { useRef, useState } from "react";
import { postLoginRequest, postRegisterRequest } from "../../api/auth";
import { useLoginStore } from "../../store/useLogin";
import Modal from "../common/Modal";
import Button from "../common/Button";
import { useNavigate } from "react-router-dom";

const LoginInputBox: React.FC = () => {
  const { isLogin, setLogin } = useLoginStore();
  const [isModalOpened, setModalOpened] = useState(false);

  const navigate = useNavigate();
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
          className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem]"
          onChange={e => (ref.current.email = e.target.value)}
        ></input>
        <label className="text-white " htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem] mb-2"
          onChange={e => (ref.current.password = e.target.value)}
          type="password"
          onKeyDown={e => {
            if (e.key === "Enter") handleLogin(userLoginInput.current);
          }}
        ></input>
      </>
    );
  };

  const handleSignup = (info: { name: string; email: string; password: string }) => {
    postRegisterRequest(info.name, info.email, info.password)
      .then(res => {
        setLogin(info.email, info.name, res.accessToken);
        navigate("/lobby");
      })
      .catch(err => {
        alert(err.response.data.message);
      });
  };

  const handleLogin = (info: { email: string; password: string }) => {
    postLoginRequest(info.email, info.password)
      .then(res => {
        console.log(res);
        setLogin(info.email, res.data.nickname, res.data.accessToken);
        navigate("/lobby");
      })
      .catch(err => {
        err.response.status === 401 && alert("이메일 또는 비밀번호가 일치하지 않습니다.");
      });
  };

  return (
    <>
      {!isLogin ? (
        <div className="flex flex-col items-start">
          {infoInput(userLoginInput)}
          <div className="w-full flex flex-row items-center justify-between text-[0.75rem] px-2 text-white mb-4">
            <div className="flex flex-row items-center gap-2">
              <button className="rounded-full aspect-square bg-[#D9D9D9] w-[1em]"></button>
              <p>로그인 저장</p>
            </div>
            <button onClick={() => setModalOpened(true)}>회원가입</button>
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
          </div>

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
