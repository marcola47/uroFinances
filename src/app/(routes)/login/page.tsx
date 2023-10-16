import Navbar from "@/app/components/Navbar/Navbar";
import { FormLogin } from "@/app/components/Forms/Forms";

export default function LoginPage(): JSX.Element {
  return (
    <div className="app">
      <Navbar/>
      
      <div className="login">
        <img 
          src="next.svg" 
          alt="" 
          className="login__logo"
        />

        <FormLogin/>
      </div>
    </div>
  );
}