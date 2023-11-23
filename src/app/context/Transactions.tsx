"use client";
import { useState, useEffect, useContext, createContext, Dispatch, SetStateAction } from "react";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();

  const [transactions, setTransactions] = useState<TTransaction[]>([]);
  const [recurrences, setRecurrences] = useState<TRecurrence[]>([]);

  async function getRecurrences() {
    if (session?.user?.id) {
      const res = await fetch(`/api/recurrences?user=${session.user.id}`, {
        method: "GET",
        headers: { "type": "application/json" }
      });

      const { status, err, data } = await res.json();
      
      if (status < 200 || status >= 400) 
        console.log(err);

      else 
        setRecurrences(data);
    }
  }

  async function getTransactions() {
    if (session?.user?.id) {
      const res = await fetch(`/api/transactions?user=${session.user.id}`, {
        method: "GET",
        headers: { "type": "application/json" }
      });

      const { status, err, data } = await res.json();

      if (status < 200 || status >= 400) 
        console.log(err);

      else 
        setTransactions(data);
    }
  }

  useEffect(() => { 
    getTransactions();
    getRecurrences();
  }, [session])

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