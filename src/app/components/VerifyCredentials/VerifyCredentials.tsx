"use client";
import { useEffect } from 'react';
import { redirect, usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";

export default function VerifyCredentials(): JSX.Element {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  useEffect(() => {
    console.log(session)

    //@ts-expect-error
    if (session?.user?.missingPassword === true && pathname !== '/auth/change-password')
      redirect('/ath/change-password');

    //@ts-expect-error
    else if (session?.user?.emailVerified === false && pathname !== '/auth/verify-email')
      redirect('/auth/verify-email');
  }, [session, pathname])

  return <div/>  
}