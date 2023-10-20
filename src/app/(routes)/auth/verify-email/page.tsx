"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";
import Navbar from "@/app/components/Navbar/Navbar"

export default function VerifyEmailPage(): JSX.Element {
  const { data: session } = useSession();

  //@ts-expect-error
  if (session?.user.emailVerified === true)
    redirect('/auth/email-verified');

  return (
    <div className="app">
      <Navbar/>

      <div className="ver-email">
        verify email
      </div>
    </div>
  )
}