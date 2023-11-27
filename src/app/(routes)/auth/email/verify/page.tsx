"use client";
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import { FaEnvelope } from "react-icons/fa6";

export default function VerifyEmailPage(): JSX.Element {
  const { data: session } = useSession();
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  if (session?.user.emailVerified === true)
    redirect('/auth/email/verified');

  useEffect(() => {
    if (error.length > 0)
      throw new Error(error);
  }, [error])

  async function handleSendEmail(type: string): Promise<void> {
    if (!session?.user)
      return;

    const res = await fetch('/api/auth/email/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id: session!.user!.id, 
        name: session!.user!.name, 
        email: session!.user!.email 
      })
    });

    if (type === 'resend') {
      const { status, err } = await res.json();
      switch (true) {
        case status < 300: 
          setEmailSent(true); 
          break;
  
        case status >= 300 && status < 400:
          setEmailSent(true);
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
  }

  // verify if already sent initial email first
  // useEffect(() => {
  //   if (sessio n?.user)
  //     handleSendEmail("initial")
  // }, [])

  return (
    <div className="email-verify">
      <div className="email-verify__icon">
        <FaEnvelope/>
      </div>

      <h1 className="email-verify__header">
        VERIFY YOUR EMAIL
      </h1>

      <p className="email-verify__text">
        We sent a verification link to your registered email.
      </p>

      {
        !emailSent
        ? <button 
            className="btn btn--bg-blue"
            onClick={ () => {handleSendEmail("resend")} }
          > SEND EMAIL AGAIN
          </button>
        
        : <button className="btn btn--disabled btn--bg-blue">
            EMAIL SENT
          </button>
      }
    </div>
  )
}