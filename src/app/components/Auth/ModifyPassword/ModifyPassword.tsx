"use client"
import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

export function ResetPassword({ 
  type, id, name, email 
}: { 
  type: string, id: any, name: any, email: any 
}): JSX.Element {
  const [error, setError] = useState<string>("")
  const router = useRouter();

  useEffect(() => { 
    if (error.length > 0) 
      throw new Error(error);
  }, [error])

  async function handleResetPassword(): Promise<void> {
    const res = await fetch("/api/auth/password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email })
    })

    const { status, err } = await res.json();
    switch (true) {
      case status < 300: 
        router.push('/auth/email/sent'); 
        break;

      case status >= 300 && status < 400:
        router.push('/'); 
        break;
      
      case status >= 400 && status < 500: 
        console.log(err);
        setError("There was a problem processing the submitted data"); 
        break;
      
      case status >= 500:
        console.log(err); 
        setError("There was a problem processing your request in the server"); 
        break;
      
      default: 
        console.log(err);
        setError("There was a problem processing your request. Error unknown, please try again later");
    }
  }
  
  return (
    <button 
      className="btn btn--bg-blue"
      onClick={ handleResetPassword }
    > { type === "create" ? "CREATE NEW PASSWORD" : "RESET PASSWORD"}
    </button>
  )
}

export function UpdatePassword(): JSX.Element {
  async function handleUpdatePassword(): Promise<void> {
    
  }
  
  return (
    <button 
      className="btn--update-pwd"
      onClick={ handleUpdatePassword }
    > UPDATE PASSWORD
    </button>
  )
}