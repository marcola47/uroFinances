"use client";
import { useState, useContext, createContext, Dispatch, SetStateAction } from "react";
import { TTransaction, TRecurrence } from "@/types/types";

interface TransactionsContextProps {
  transactions: TTransaction[];
  setTransactions: Dispatch<SetStateAction<TTransaction[]>>;

  recurrences: TRecurrence[];
  setRecurrences: Dispatch<SetStateAction<TRecurrence[]>>; 
}

const TransactionsContext = createContext<TransactionsContextProps>({
  transactions: [],
  setTransactions: () => {},

  recurrences: [],
  setRecurrences: () => {}
});

export const TransactionsContextProvider = ({ children }: { children: any }) => {
  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [recurrences, setRecurrences] = useState<TRecurrence[]>([]);

  return (
    <TransactionsContext.Provider value={{ 
      transactions, 
      setTransactions, 
      recurrences, 
      setRecurrences 
    }}> { children }
    </TransactionsContext.Provider>
  )
}

export const useTransactionsContext = () => useContext(TransactionsContext);
// initialy I'll refresh transactions context everytime the month changes, later I'll cache it.