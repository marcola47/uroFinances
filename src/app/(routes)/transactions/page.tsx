"use client"
import { useEffect } from "react";

import { useTransactionsContext } from "@/app/context/Transactions";
import { useDateContext } from "@/app/context/Date";
import { useUIContext } from "@/app/context/Ui";
import { useSession } from "next-auth/react";

import MonthTab from "@/app/components/LayoutClient/MonthTab/MonthTab"
import TransactionList from "@/app/components/Transactions/TransactionList";
import ModalTransaction from "@/app/components/Modals/ModalTransaction";

export default function TransactionsPage(): JSX.Element {
  const { data: session } = useSession();
  const { transactions, setTransactions, setRecurrences } = useTransactionsContext();
  const { modalTransShown, modalTransData } = useUIContext();
  const { date } = useDateContext();

  async function getRecurrences() {
    if (session?.user?.id) {
      const res = await fetch(`/api/recurrences?user=${session.user.id}`, {
        method: "GET",
        headers: { "type": "application/json" }
      });

      const { status, err, data } = await res.json();
      console.log(data)
      
      if (status < 200 || status >= 400) 
        console.log(err);

      else 
        setRecurrences(data);
    }
  }

  async function getTransactions() {
    if (session?.user?.id && date) {
      const res = await fetch(`/api/transactions?user=${session.user.id}&date=${date}`, {
        method: "GET",
        headers: { "type": "application/json" }
      });

      const { status, err, data } = await res.json();
      console.log(data);

      if (status < 200 || status >= 400) 
        console.log(err);

      else 
        setTransactions(data);
    }
  }

  useEffect(() => { getTransactions() }, [session, date])
  useEffect(() => { getRecurrences()  }, [session])

  return (
    <>
      <div className="transactions">
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
      </div>

      {
        modalTransShown &&
        modalTransData &&
        <ModalTransaction/>
      }
    </>
  )
}