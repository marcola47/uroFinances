"use client";
import { useSession } from "next-auth/react"
import Navbar from "@/app/components/Navbar/Navbar"
import { ResetPassword } from "@/app/components/ModifyPassword/ModifyPassword"

import { FaShieldHalved } from "react-icons/fa6";

export default function CreatePasswordPage(): JSX.Element {
  const { data: session } = useSession();

  return (
    <div className="app">
      <Navbar/>

      <div className="create-pwd">
        <div className="create-pwd__icon">
          <FaShieldHalved/>
        </div>

        <h1 className="create-pwd__header">
          CREATE A PASSWORD 
        </h1>
        <p className="create-pwd__text">
          You have previously logged in with a provider account like Google or Github. 
          Please create a password to continue with your credentials.
        </p>

        <ResetPassword 
          type="create"
          id={ session?.user?.id } 
          name={ session?.user?.name } 
          email={ session?.user?.email }
        />
      </div>
    </div>
  )
}