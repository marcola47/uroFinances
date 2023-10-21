"use client";
import { useRouter } from 'next/navigation'

import { useState, useRef } from "react";
import { usePathname } from 'next/navigation';
import { FaKey } from "react-icons/fa6";
import Navbar from "@/app/components/Navbar/Navbar"

export default function CreatePasswordPage(): JSX.Element {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const pathname = usePathname();
  const token = (pathname.split("/"))[pathname.split("/").length - 1];

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

    const res = await fetch(`/api/auth/reset-password/${token}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    const { status } = await res.json();
    
    if (status === 200)
      router.push("/auth/password-reset?status=success")

    else
      router.push("/auth/password-reset?status=error")
  }

  return (
    <div className="app">
      <Navbar/>

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
            children="RESET PASSWORD"
          />
        </div>
      </div>
    </div>
  )
}