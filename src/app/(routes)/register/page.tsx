import RegisterForm from "@/app/components/RegisterForm/RegisterForm";

export default function RegisterPage(): JSX.Element {
  return (
    <div className="register">
      <img 
        src="next.svg" 
        alt="" 
        className="register__logo"
      />

      <RegisterForm/>
    </div>
  );
}