import Navbar from "@/app/components/Navbar/Navbar";
import { FormLogin } from "@/app/components/Forms/Forms";

type Props = { searchParams?: Record<"callbackUrl"|"error", string> }

export default function LoginPage(props: Props): JSX.Element {
  return (
    <div className="app">
      <Navbar/>
      
      <div className="login">
        <img 
          src="/next.svg" 
          alt="" 
          className="login__logo"
        />

        <FormLogin
          callbackUrl={ props.searchParams?.callbackUrl }
          error={ props.searchParams?.error }
        />
      </div>
    </div>
  );
}