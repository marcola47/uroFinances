"use client"
import { useState, useRef } from "react"
import { FaUser, FaEnvelope, FaKey } from 'react-icons/fa';

export default function RegisterForm(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  function handleRegister(): void
  {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    console.log({ name, email, password })
  }

  return (
    <div className="form form--register">
      <h1 className="form__title">
        Register
      </h1>

      <div className="form__input">
        <FaUser/>
        <input 
          type="text" 
          name="name" 
          id="name" 
          ref={ nameRef }
          placeholder="Your name"
        />
      </div>

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

      <div className="form__input">
        <FaKey/>
        <input 
          type="password" 
          name="passwordConfirmation" 
          id="passwordConfirmation" 
          ref={ passwordConfirmRef }
          placeholder="Confirm your password"
        />
      </div>

      <button 
        className="form__button"
        onClick={ handleRegister }
        children="Register"
      />
    </div>
  )
}