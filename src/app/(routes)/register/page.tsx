import Navbar from "@/app/components/Navbar/Navbar";
import RegisterForm from "@/app/components/RegisterForm/RegisterForm";

export default function RegisterPage(): JSX.Element {
  return (
    <div className="app">
      <Navbar/>

      <div className="register">
        <img 
          src="next.svg" 
          alt="" 
          className="register__logo"
        />

        <RegisterForm/>
      </div>
    </div>
  );
}