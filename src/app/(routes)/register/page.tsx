import { FormRegister } from "@/app/components/Forms/Forms";

export default function RegisterPage(): JSX.Element {
  return (
    <div className="app">      
      <div className="register">
        <div className="register__content">
          <img 
            src="/next.svg" 
            alt="" 
            className="register__logo"
          />

          <FormRegister/>
        </div>
        
        <img 
          src="/bg/credentials__bg--dark.png" 
          alt="background" 
          className="register__bg"
        />
      </div>
    </div>
  );
}