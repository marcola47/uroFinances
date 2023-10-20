import Navbar from "@/app/components/Navbar/Navbar";
import { FormRegister } from "@/app/components/Forms/Forms";

export default function RegisterPage(): JSX.Element {
  return (
    <div className="app">
      <Navbar/>

      <div className="register">
        <img 
          src="/next.svg" 
          alt="" 
          className="register__logo"
        />

        <FormRegister/>
      </div>
    </div>
  );
}