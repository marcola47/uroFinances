"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import { TTransaction } from "@/types/types";

interface TransactionsContextProps {
  transactions: TTransaction[];
  setTransactions: Dispatch<SetStateAction<TTransaction[]>>;
}

const TransactionsContext = createContext<TransactionsContextProps>({
  transactions: [],
  setTransactions: () => {},
});

export const TransactionsContextProvider = ({ children }: { children: any }) => {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);

  return (
    <TransactionsContext.Provider value={{ transactions, setTransactions }}>
      { children }
    </TransactionsContext.Provider>
  )
}

export const useTransactionsContext = () => useContext(TransactionsContext);
// initialy I'll refresh transactions context everytime the month changes, later I'll cache it.