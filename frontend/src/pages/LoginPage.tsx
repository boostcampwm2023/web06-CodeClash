import LoginInputBox from "../components/login/LoginInputBox";
import LoginLogo from "../components/login/LoginLogo";

const LoginPage: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <LoginLogo />
      <LoginInputBox />
    </div>
  );
};

export default LoginPage;
