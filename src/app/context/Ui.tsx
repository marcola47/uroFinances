"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import { TTransaction, TRecurrence } from "@/types/types";

type ModalTransData = Partial<TTransaction> & TRecurrence & {
  operation: "update" | "create";
}

interface UIContextProps {
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;

  modalTransShown: boolean;
  setModalTransShown: Dispatch<SetStateAction<boolean>>;

  modalTransData: ModalTransData | null;
  setModalTransData: Dispatch<SetStateAction<ModalTransData | null>>;
}

const UIContext = createContext<UIContextProps>({
  navbarOpen: false,
  setNavbarOpen: () => {},

  modalTransShown: false,
  setModalTransShown: () => {},

  modalTransData: null,
  setModalTransData: () => {}
});

export const UIContextProvider = ({ children }: { children: any }) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [modalTransShown, setModalTransShown] = useState<boolean>(false);
  const [modalTransData, setModalTransData] = useState<ModalTransData | null>(null);

  return (
    <UIContext.Provider value={{ 
      navbarOpen, setNavbarOpen, 
      modalTransShown, setModalTransShown,
      modalTransData, setModalTransData,
    }}> { children }
    </UIContext.Provider>
  )
}

export const useUIContext = () => useContext(UIContext);