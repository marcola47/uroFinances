"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaKey } from "react-icons/fa6";

export default function CreatePasswordPage(): JSX.Element {
  const { data: session } = useSession();
  const router = useRouter();

  const [error, setError] = useState<string>("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const token = (pathname.split("/"))[pathname.split("/").length - 1];

  useEffect(() => { 
    if (error.length > 0) 
      throw new Error(error);
  }, [error])

  async function handlePasswordReset(): Promise<void> {
    const password = passwordRef.current?.value || "";
    const confirmPassword = passwordConfirmRef.current?.value || "";

    if (password === "" || confirmPassword === "") {
      console.log("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      console.log("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      console.log("Password must be at least 8 characters long");
      return;
    }

    const res = await fetch(`/api/auth/password/reset/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const { status, err } = await res.json();
    switch (true) {
      case status < 300:
        router.push(`${session?.user ? '/' : '/login'}`); 
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
    <div className="create-pwd">
      <div className="form">
        <div className="form__inputs">
          <div className="form__input">
            <FaKey/>
            <input 
              type="password" 
              name="password" 
              id="password" 
              ref={ passwordRef }
              value={ password }
              onChange={ (e) => {setPassword(e.target.value)} }
              placeholder="Your password"
            />
          </div>

          <div className="form__input">
            <FaKey/>
            <input 
              type="password" 
              name="passwordConfirmation" 
              id="passwordConfirmation" 
              ref={ passwordConfirmRef }
              value={ passwordConfirm }
              onChange={ (e) => {setPasswordConfirm(e.target.value)} }
              placeholder="Confirm your password"
            />
          </div>
        </div>

        <button 
          className="form__submit"
          onClick={ handlePasswordReset }
        > RESET PASSWORD
        </button>
      </div>
    </div>
  )
}