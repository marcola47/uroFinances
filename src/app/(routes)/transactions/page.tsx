"use client"
import { useState, useEffect } from "react";

import { TTransaction, TRecurrence, TUUID } from "@/types/types";
import { useTransactionsContext } from "@/app/context/Transactions";
import { useDateContext } from "@/app/context/Date";
import { useUIContext } from "@/app/context/Ui";
import { useSession } from "next-auth/react";

import { getMonthRange, shouldRecurrenceShow } from "@/libs/helpers/dateFunctions";

import MonthTab from "@/app/components/LayoutClient/MonthTab/MonthTab"
import TransactionList from "@/app/components/Transactions/TransactionList";
import ModalTransaction from "@/app/components/Modals/ModalTransaction";

export default function TransactionsPage(): JSX.Element {
  const [thisMonthTransactions, setThisMonthTransactions] = useState<TTransaction[]>([]);
  const [pendingRecurrences, setPendingRecurrences] = useState<TRecurrence[]>([]);

  const { data: session } = useSession();
  const { transactions, setTransactions, recurrences, setRecurrences } = useTransactionsContext();
  const { modalTransShown, modalTransData } = useUIContext();
  const { date } = useDateContext();

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
    if (session?.user?.id && date) {
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

  useEffect(() => {
    if (transactions.length > 0 && recurrences.length > 0) {
      const { startDate, endDate } = getMonthRange(new Date(date))
      const confirmedRecurrences: TUUID[] = [];
      const confirmedTransactions: TTransaction[] = [];

      // verify if cur month matches the recurrence period and due date
      transactions.forEach(t => {
        const isDueDateBetween = new Date(t.due_date) >= startDate && new Date(t.due_date) <= endDate;
        const isConfirmedDateBetween = t.confirmation_date && (new Date(t.confirmation_date) >= startDate && new Date(t.confirmation_date) <= endDate);

        if (t.recurrence) {
          if (isDueDateBetween && isConfirmedDateBetween)
            confirmedRecurrences.push(t.recurrence);

          else if (isDueDateBetween && !isConfirmedDateBetween)
            confirmedRecurrences.push(t.recurrence);
        }

        else if (isDueDateBetween || isConfirmedDateBetween)
          confirmedTransactions.push(t); 
      })

      setThisMonthTransactions(confirmedTransactions);
      setPendingRecurrences(recurrences.filter(r => !confirmedRecurrences.includes(r.id) && shouldRecurrenceShow(r.due_date, date, r.recurrence_period)));
    }
  }, [transactions, recurrences, date])

  return (
    <>
      <div className="transactions">
        <div className="transactions__top">
          <MonthTab/>
        </div>

        <div className="transactions__container">
          <div className="transactions__lists">
            <TransactionList
              transactions={ thisMonthTransactions.filter(t => t.type === "income") } 
              recurrences={ pendingRecurrences.filter(r => r.type === "income") }
              type="income"
            /> 

            <TransactionList 
              transactions={ thisMonthTransactions.filter(t => t.type === "expense") }
              recurrences={ pendingRecurrences.filter(r => r.type === "expense") }
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