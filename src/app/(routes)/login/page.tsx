import { FormLogin } from "@/app/components/Forms/Forms";

type Props = { searchParams?: Record<"callbackUrl"|"error", string> }

export default function LoginPage(props: Props): JSX.Element {
  return (
    <div className="app">      
      <div className="login">
        <div className="login__content">
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
        
        <img 
          src="/bg/credentials__bg--dark.png" 
          alt="background" 
          className="login__bg"
        />
      </div>
    </div>
  );
}