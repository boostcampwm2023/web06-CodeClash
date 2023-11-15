import { useState } from "react";

const LoginInputBox: React.FC = () => {
  const [loggedin, setLoggedIn] = useState(false);

  return (
    <>
      {!loggedin ? (
        <div className="flex flex-col items-start">
          <label className="text-white ">아이디</label>
          <input className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem]"></input>
          <label className="text-white ">비밀번호</label>
          <input className="rounded-full border-[3px] border-white text-[0.75rem] p-1 outline-none bg-[#D9D9D9] w-[15rem] mb-2"></input>

          <div className="w-full flex flex-row items-center justify-between text-[0.75rem] px-2 text-white mb-4">
            <div className="flex flex-row items-center gap-2">
              <button className="rounded-full aspect-square bg-[#D9D9D9] w-[1em]"></button>
              <p>로그인 저장</p>
            </div>
            <button>회원가입</button>
          </div>

          <button
            className=" text-center w-full rounded-full bg-pink text-[0.75rem] text-white py-1"
            onClick={() => setLoggedIn(true)}
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
