"use client";
import { useState, useContext, useEffect, createContext, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";
import { redirect, usePathname } from 'next/navigation';

import { TUser } from "@/types/types";

interface UserContextProps {
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>>;
}

const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => {},
});

export const UserContextProvider = ({ children }: { children: any }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState<TUser | null>(null);
  const pathname = usePathname();

  async function getUser() {
    // console.log(session);
    // console.log(user)

    if (!user && session?.user) {
      const res = await fetch(`/api/user?user=${session?.user?.id}`);
      const { status, data, error } = await res.json();
  
      if (status < 200 || status >= 400)
        console.error(error);
  
      else
        setUser(data);
    }
  }

  useEffect(() => { 
    getUser();

    const notPasswordRoute = !pathname.includes('/auth/password/create') && !pathname.includes('/auth/email/sent');
    const notEmailRoute = !pathname.includes('/auth/email/verify') && !pathname.includes('/auth/email/sent');

    if (session?.user?.missingPassword === true && notPasswordRoute && notEmailRoute)
      redirect('/auth/password/create');

    else if (session?.user?.emailVerified === false && notEmailRoute && notPasswordRoute)
      redirect('/auth/email/verify');
  }, [user, session, pathname])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext);