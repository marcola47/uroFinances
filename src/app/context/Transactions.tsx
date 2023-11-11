"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import { TypeTransaction } from "@/types/types";

interface TransactionsContextProps {
  transactions: TypeTransaction[];
  setTransactions: Dispatch<SetStateAction<TypeTransaction[]>>;
}

const TransactionsContext = createContext<TransactionsContextProps>({
  transactions: [],
  setTransactions: () => {},
});

export const TransactionsContextProvider = ({ children }: { children: any }) => {
  const [transactions, setTransactions] = useState<TypeTransaction[]>([]);

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      { children }
    </TransactionsContext.Provider>
  )
}

export const useTransactionsContext = () => useContext(TransactionsContext);
// initialy I'll refresh transactions context everytime the month changes, later I'll cache it.