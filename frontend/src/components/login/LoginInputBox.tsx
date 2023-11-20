import { useRef } from "react";
import { postLoginRequest, postRegisterRequest } from "../../api/auth";
import { useLoginStore } from "../../store/useLogin";

const LoginInputBox: React.FC = () => {
  const { isLogin, setIsLogin, setEmail, setNickname, setAccessToken, setLogin } = useLoginStore();
  const userInfo = useRef({
    email: "",
    password: "",
  });

  const handleSignup = (name: string = "", email: string, password: string) => {
    postRegisterRequest(name, email, password);
  };

  const handleLogin = (email: string, password: string) => {
    postLoginRequest(email, password)
      .then(res => {
        if (res.status === 201) {
          setLogin(email, res.data.nickname, res.data.accessToken);
        }
      })
      .catch(err => alert(err));
  };

  return (
    <>
      {!isLogin ? (
        <div className="flex flex-col items-start">
          <label className="text-white " htmlFor="email">
            이메일
          </label>
          <input
            id="email"
            className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem]"
            onChange={e => (userInfo.current.email = e.target.value)}
          ></input>
          <label className="text-white " htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem] mb-2"
            onChange={e => (userInfo.current.password = e.target.value)}
          ></input>

          <div className="w-full flex flex-row items-center justify-between text-[0.75rem] px-2 text-white mb-4">
            <div className="flex flex-row items-center gap-2">
              <button className="rounded-full aspect-square bg-[#D9D9D9] w-[1em]"></button>
              <p>로그인 저장</p>
            </div>
            <button>회원가입</button>
          </div>

          <button
            className=" text-center w-full rounded-full bg-pink text-[0.75rem] text-white py-1"
            onClick={() => handleLogin(userInfo.current.email, userInfo.current.password)}
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
