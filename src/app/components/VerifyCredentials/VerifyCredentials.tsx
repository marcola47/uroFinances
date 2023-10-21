"use client";
import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function VerifyCredentials(): JSX.Element {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  useEffect(() => {
    console.log(session)

    if (session?.user?.missingPassword === true && !pathname.includes("/auth/password/create"))
      redirect('/auth/password/create');

    else if (session?.user?.emailVerified === false && pathname !== '/auth/email/verify')
      redirect('/auth/email/verify');
  }, [session, pathname])

  return <div/>  
}