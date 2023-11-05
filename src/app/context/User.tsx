"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";

interface UserProps {
  id: string,
  name: string,
  email: string,
  image: string,
  emailVerified: boolean,
  provider: string,
  providerID: string | number,
  
  categories: {
    root: string,
    child: string | null,
    grandchild: string | null
  }[]
}

interface UserContextProps {

}

const UserContext = createContext<UserContextProps>({
  date: new Date(),
  setDate: () => {},
});

export const UserContextProvider = ({ children }: { children: any }) => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <UserContext.Provider value={{ date, setDate }}>
      { children }
    </UserContext.Provider>
  )
}

export const useUserContext = () => useContext(UserContext);

// if (session?.user) {
//   const res = await fetch(`http://localhost:3000/api/user?user=${session?.user?.id}&data=categories`, {
//     method: 'GET',
//     headers: { 'Content-Type': 'application/json' }
//   });

//   const { data } = await res.json();
//   session.user.categories = data;
// }