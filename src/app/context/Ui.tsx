"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import { TTransaction } from "@/types/types";

type TransactionModalData = Partial<TTransaction> & {
  modalType: string;
}

interface UIContextProps {
  navbarOpen: boolean;
  setNavbarOpen: Dispatch<SetStateAction<boolean>>;

  transactionModalShown: boolean;
  setTransactionModalShown: Dispatch<SetStateAction<boolean>>;

  transactionModalData: TransactionModalData | null;
  setTransactionModalData: Dispatch<SetStateAction<TransactionModalData | null>>;
}

const UIContext = createContext<UIContextProps>({
  navbarOpen: false,
  setNavbarOpen: () => {},

  transactionModalShown: false,
  setTransactionModalShown: () => {},

  transactionModalData: null,
  setTransactionModalData: () => {}
});

export const UIContextProvider = ({ children }: { children: any }) => {
  const [navbarOpen, setNavbarOpen] = useState<boolean>(false);
  const [transactionModalShown, setTransactionModalShown] = useState<boolean>(false);
  const [transactionModalData, setTransactionModalData] = useState<TransactionModalData | null>(null);

  return (
    <UIContext.Provider value={{ 
      navbarOpen, setNavbarOpen, 
      transactionModalShown, setTransactionModalShown,
      transactionModalData, setTransactionModalData,
    }}> { children }
    </UIContext.Provider>
  )
}

export const useUIContext = () => useContext(UIContext);