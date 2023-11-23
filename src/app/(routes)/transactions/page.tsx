"use client"
import { useState, useEffect } from "react";

import { useTransactionsContext } from "@/app/context/Transactions";
import { useDateContext } from "@/app/context/Date";
import { useUIContext } from "@/app/context/Ui";

import { getMonthRange, shouldRecurrenceShow } from "@/libs/helpers/dateFunctions";

import MonthTab from "@/app/components/LayoutClient/MonthTab/MonthTab"
import TransactionList from "@/app/components/Transactions/TransactionList";
import ModalTransaction from "@/app/components/Modals/ModalTransaction";

export default function TransactionsPage(): JSX.Element {
  const [thisMonthTransactions, setThisMonthTransactions] = useState<TTransaction[]>([]);
  const [pendingRecurrences, setPendingRecurrences] = useState<TRecurrence[]>([]);

  const { transactions, recurrences } = useTransactionsContext();
  const { modalTransShown, modalTransData } = useUIContext();
  const { date } = useDateContext();

  useEffect(() => {
    const { startDate, endDate } = getMonthRange(new Date(date))
    const confirmedRecurrences: TUUID[] = [];
    const confirmedTransactions: TTransaction[] = [];

    transactions.forEach(t => {
      const isDueDateBetween = new Date(t.due_date) >= startDate && new Date(t.due_date) <= endDate;
      const isConfirmedDateBetween = t.confirmation_date && (new Date(t.confirmation_date) >= startDate && new Date(t.confirmation_date) <= endDate);

      if (t.recurrence) {
        if (isDueDateBetween) {
          confirmedRecurrences.push(t.recurrence);

          if (isConfirmedDateBetween)
            confirmedTransactions.push(t);
        }

        else if (isConfirmedDateBetween)
          confirmedTransactions.push(t);
      }

      else {
        if (isDueDateBetween && isConfirmedDateBetween)
          confirmedTransactions.push(t);

        else if (!isDueDateBetween && isConfirmedDateBetween)
          confirmedTransactions.push(t);

        else if (isDueDateBetween && !t.confirmation_date)
          confirmedTransactions.push(t);
      }
    })

    setThisMonthTransactions(confirmedTransactions);
    setPendingRecurrences(recurrences.filter(r => !confirmedRecurrences.includes(r.id) && shouldRecurrenceShow(r.due_date, date, r.recurrence_period)));
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