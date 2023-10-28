"use client";
import { useSession } from "next-auth/react";
import { FaShieldHalved } from "react-icons/fa6";

import { ResetPassword } from "@/app/components/Auth/ModifyPassword/ModifyPassword";
import AccessDenied from "@/app/components/Auth/AccessDenied/AccessDenied";

export default function CreatePasswordPage(): JSX.Element {
  const { data: session } = useSession();

  if (session?.user?.missingPassword) {
    return (
      <div className="create-pwd">
        <div className="create-pwd__icon">
          <FaShieldHalved/>
        </div>
  
        <h1 className="create-pwd__header">
          CREATE A PASSWORD 
        </h1>
        <p className="create-pwd__text">
          You have previously logged in with a provider account like Google or GitHub. 
          Please create a password to continue with your credentials.
        </p>
  
        <ResetPassword 
          type="create"
          id={ session?.user?.id } 
          name={ session?.user?.name } 
          email={ session?.user?.email }
        />
      </div>
    )
  }

  else if (session?.user?.missingPassword === false) 
    return <AccessDenied/>

  else 
    return <div/>
}