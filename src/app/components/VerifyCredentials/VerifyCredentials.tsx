"use client";
import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function VerifyCredentials(): JSX.Element {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  useEffect(() => {
    console.log(session)

    if (!session?.user && (pathname !== '/' && pathname !== '/login' && pathname !== '/register'))
      redirect('/');

    //@ts-expect-error
    else if (session?.user?.missingPassword === true && pathname !== '/auth/change-password')
      redirect('/auth/change-password');

    //@ts-expect-error
    else if (session?.user?.emailVerified === false && pathname !== '/auth/verify-email' &&  pathname !== '/auth/change-password')
      redirect('/auth/verify-email');

  }, [session, pathname])

  return <div/>  
}