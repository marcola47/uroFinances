import LoginForm from "@/app/components/LoginForm/LoginForm";

export default function LoginPage(): JSX.Element {
  return (
    <div className="app">
      <div className="login">
        <img 
          src="next.svg" 
          alt="" 
          className="login__logo"
        />

        <LoginForm/>
      </div>
    </div>
  );
}