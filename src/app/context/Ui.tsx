"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import { TTransaction } from "@/types/types";

interface UIContextProps {
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;

  transactionModalOpen: boolean;
  setTransactionModalOpen: Dispatch<SetStateAction<boolean>>;

  transactionModalData: TTransaction | null;
  setTransactionModalData: Dispatch<SetStateAction<TTransaction | null>>;
}

const UIContext = createContext<UIContextProps>({
  navbarOpen: false,
  setNavbarOpen: () => {},

  transactionModalOpen: false,
  setTransactionModalOpen: () => {},

  transactionModalData: null,
  setTransactionModalData: () => {}
});

export const UIContextProvider = ({ children }: { children: any }) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [transactionModalOpen, setTransactionModalOpen] = useState<boolean>(false);
  const [transactionModalData, setTransactionModalData] = useState<TTransaction | null>(null);

  return (
    <UIContext.Provider value={{ 
      navbarOpen, setNavbarOpen, 
      transactionModalOpen, setTransactionModalOpen,
      transactionModalData, setTransactionModalData,
    }}> { children }
    </UIContext.Provider>
  )
}

export const useUIContext = () => useContext(UIContext);