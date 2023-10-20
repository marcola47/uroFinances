"use client"
import { useState, useRef } from "react"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FaUser, FaEnvelope, FaKey } from 'react-icons/fa';

type Props = { 
  callbackUrl?: string,
  error?: string 
}

export function FormLogin(props: Props): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function handleOAuthLogin(provider: string): Promise<void> {
    await signIn(provider, {
      callbackUrl: props.callbackUrl || "/",
    });
  }

  async function handleCredentialsLogin(): Promise<void> {
    await signIn("credentials", {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      callbackUrl: props.callbackUrl || "/"
    });
  }

  return (
    <div className="form form--login">
      <div className="form__oauth">
        <div 
          className="form__btn form__btn--github"
          onClick={ () => { handleOAuthLogin('github') } }
        >
          <img 
            src="/logos/logo__github.svg" 
            alt="" 
            className="form__button__logo"
          />

          <span
            className="form__button__text"
            children="LOGIN WITH GITHUB"
          />
        </div>

        <div 
          className="form__btn form__btn--google"
          onClick={ () => { handleOAuthLogin('google') } }
        >
          <img 
            src="/logos/logo__google.svg" 
            alt="" 
            className="form__button__logo"
          />

          <span
            className="form__button__text"
            children="LOGIN WITH GOOGLE"
          />
        </div>
      </div>

      <div className="form__divider">
        <span className="form__divider__text">or</span>
      </div>

      <div className="form__inputs">
        <div className="form__input">
          <FaEnvelope/>
          <input 
            type="email" 
            name="email" 
            id="email" 
            ref={ emailRef }
            value={ email }
            onChange={ (e) => {setEmail(e.target.value)} }
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
            value={ password }
            onChange={ (e) => {setPassword(e.target.value)} }
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
        onClick={ handleCredentialsLogin }
        children="LOGIN"
      />
    </div>
  )
}

export function FormRegister(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  async function handleRegister(): Promise<void>
  {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const name = nameRef.current?.value || "";
    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const passwordConfirm = passwordConfirmRef.current?.value || "";

    if (name === "" || email === "" || password === "" || passwordConfirm === "") {
      console.log("Please fill all fields");
      return;
    }

    if (!emailRegex.test(email)) {
      console.log("Invalid email");
      return;
    }

    if (password !== passwordConfirm) {
      console.log("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      console.log("Password must be at least 8 characters long");
      return;
    }

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    console.log(await res.json());
    await signIn("credentials", {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      callbackUrl: "/",
    });
  }

  return (
    <div className="form form--register">
      <div className="form__inputs">
        <div className="form__input">
          <FaUser/>
          <input 
            type="text" 
            name="name" 
            id="name" 
            ref={ nameRef }
            value={ name }
            onChange={ (e) => {setName(e.target.value)} }
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
            value={ email }
            onChange={ (e) => {setEmail(e.target.value)} }
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

      <div 
        className="form__cta"
        onClick={ () => {router.push("/login");} }
        children="Already have an account? Click here to login"
      />

      <button 
        className="form__submit"
        onClick={ handleRegister }
        children="REGISTER"
      />
    </div>
  )
}