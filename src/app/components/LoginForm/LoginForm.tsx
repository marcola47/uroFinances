"use client"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation";
import { FaEnvelope, FaKey } from 'react-icons/fa';

export default function RegisterForm(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  function handleLogin(): void
  {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    console.log({ name, email, password })
  }

  return (
    <div className="form form--register">
      <div className="form__inputs">
        <div className="form__input">
          <FaEnvelope/>
          <input 
            type="email" 
            name="email" 
            id="email" 
            ref={ emailRef }
            placeholder="Your email"
          />
        </div>

        <div className="form__input">
          <FaKey/>
          <input 
            type="password" 
            name="password" 
            id="password" 
            ref={ passwordRef }
            placeholder="Your password"
          />
        </div>
      </div>

      <div 
        className="form__cta"
        onClick={ () => {router.push("/register")} }
        children="Don't have an account? Click here to register!"
      />

      <button 
        className="form__submit"
        onClick={ handleLogin }
        children="LOGIN"
      />
    </div>
  )
}