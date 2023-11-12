"use client"
import { useEffect } from "react";

import { TTransaction } from "@/types/types";
import { useTransactionsContext } from "@/app/context/Transactions";
import { useDateContext } from "@/app/context/Date";
import { useSession } from "next-auth/react";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { DatePicker } from "@mui/x-date-pickers";
import MonthTab from "@/app/components/LayoutClient/MonthTab/MonthTab"
import TransactionList from "@/app/components/Transactions/TransactionList";
import TransactionModal from "@/app/components/Transactions/TransactionModal";

export default function TransactionsPage(): JSX.Element {
  const { transactions, setTransactions } = useTransactionsContext();
  const { data: session } = useSession();
  const { date } = useDateContext();

  useEffect(() => { 
    async function getTransactions() {
      const res = await fetch(`/api/transactions?user=${session?.user?.id}&date=${date}`, {
        method: "GET",
        headers: { "type": "application/json" }
      });
  
      const { status, err, data } = await res.json();
      
      if (status < 200 || status >= 400) 
        console.log(err);
    
      else 
        setTransactions(data);
    }
    
    getTransactions();
  }, [date])

  return (
    <LocalizationProvider dateAdapter={ AdapterDateFns }>
      {/* <div className="transactions">
        <div className="transactions__top">
          <MonthTab/>
        </div>

        <div className="transactions__container">
          <div className="transactions__lists">
            <TransactionList
              transactions={ transactions.filter(t => t.type === "income") } 
              type="income"
            /> 

            <TransactionList 
              transactions={ transactions.filter(t => t.type === "expense") }
              type="expense"
            /> 
          </div>
        </div>
      </div> */}

      <DatePicker/>
    </LocalizationProvider>
  )
}