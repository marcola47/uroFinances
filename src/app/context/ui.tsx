"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";

interface UIContextProps {
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;
}

const UIContext = createContext<UIContextProps>({
  navbarOpen: false,
  setNavbarOpen: () => {},
});

export const UIContextProvider = ({ children }: { children: any }) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);

  return (
    <UIContext.Provider value={{ navbarOpen, setNavbarOpen }}>
      { children }
    </UIContext.Provider>
  )
}

export const useUIContext = () => useContext(UIContext);