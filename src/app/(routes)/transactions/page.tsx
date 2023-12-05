"use client"
import { useState, useEffect } from "react";

import { useTransactionsContext } from "@/app/context/Transactions";
import { useDateContext } from "@/app/context/Date";
import { useUIContext } from "@/app/context/Ui";

import { getMonthRange, shouldRecurrenceShow, applyTimeZoneOffset } from "@/libs/helpers/dateFunctions";

import MonthTab from "@/app/components//MonthTab/MonthTab"
import TransactionList from "@/app/components/.Transactions/TransactionList";
import ModalTransaction from "@/app/components/.Modals/ModalTransaction";

export default function TransactionsPage(): JSX.Element {
  const [thisMonthTransactions, setThisMonthTransactions] = useState<TTransaction[]>([]);
  const [pendingRecurrences, setPendingRecurrences] = useState<TRecurrence[]>([]);

  const { transactions, recurrences } = useTransactionsContext();
  const { modalTrans } = useUIContext();
  const { date } = useDateContext();

  useEffect(() => {
    const confirmedRecurrences: TUUID[] = [];
    const confirmedTransactions: TTransaction[] = [];
    const { startDate, endDate } = getMonthRange(new Date(date));
    const localizedStartDate = applyTimeZoneOffset(startDate);
    const localizedEndDate = applyTimeZoneOffset(endDate);

    // FIX: recurrences with a due date of like november 30th will show up in february as 30/02    
    transactions.forEach(t => {
      const dueDate = new Date(t.due_date);
      const confirmationDate = new Date(t.confirmation_date!);

      const isDueDateBetween = dueDate >= localizedStartDate && dueDate <= localizedEndDate;
      const isConfirmedDateBetween = t.confirmation_date && (confirmationDate >= localizedStartDate && confirmationDate <= localizedEndDate);

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
      <div className="page transactions">
        <div className="page__top">
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
        modalTrans &&
        <ModalTransaction/>
      }
    </>
  )
}