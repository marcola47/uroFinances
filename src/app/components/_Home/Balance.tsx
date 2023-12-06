"use client";
import { useState, useEffect } from "react";

import { useTransactionsContext } from "@/app/context/Transactions";
import { useDateContext } from "@/app/context/Date";

import { getMonthRange, applyTimeZoneOffset, shouldRecurrenceShow } from "@/libs/helpers/dateFunctions";

export default function Balance(): JSX.Element {    
  const { transactions, recurrences } = useTransactionsContext();
  const { date } = useDateContext();
  
  const [initial, setInitial] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [foreseen, setForeseen] = useState<number>(0);

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    if (transactions.length > 0 || recurrences.length > 0) {
      const { startDate, endDate } = getMonthRange(new Date(date));
      const localizedStartDate = applyTimeZoneOffset(startDate);
      const localizedEndDate = applyTimeZoneOffset(endDate);
      
      let newInitialIncomes = 0, newInitialExpenses = 0;
      let newBalanceIncomes = 0, newBalanceExpenses = 0;
      let newForeseenIncomes = 0, newForeseenExpenses = 0;
      const paidRecurrences: { id: TUUID, dates: Date[] }[] = []

      transactions.forEach(t => {
        const confirmationDate = t.confirmation_date && new Date(t.confirmation_date);
        const dueDate = new Date(t.due_date);

        if (confirmationDate) {
          if (t.recurrence) {
            const existingRecurrenceIndex = paidRecurrences.findIndex(r => r.id === t.recurrence);

            if (existingRecurrenceIndex === -1) {
              paidRecurrences.push({ 
                id: t.recurrence, 
                dates: [confirmationDate] 
              })
            }

            else 
              paidRecurrences[existingRecurrenceIndex].dates.push(confirmationDate);
          }

          if (confirmationDate < localizedStartDate) {
            if (t.type === "income")
              newInitialIncomes += t.amount;

            else
              newInitialExpenses += t.amount;
          }

          else if (confirmationDate >= localizedStartDate && confirmationDate <= localizedEndDate) {
            if (t.type === "income")
              newBalanceIncomes += t.amount;

            else
              newBalanceExpenses += t.amount;
          }
        }

        else {
          if (dueDate < localizedStartDate) {
            if (t.type === "income")
              newInitialIncomes += t.amount;

            else
              newInitialExpenses += t.amount;
          }

          if (dueDate >= localizedStartDate && dueDate <= localizedEndDate) {
            if (t.type === "income")
              newForeseenIncomes += t.amount;
  
            else
              newForeseenExpenses += t.amount;
          }
        }
      })

      recurrences.forEach(r => {
        const paidRecurrence = paidRecurrences.find(pr => pr.id === r.id);
        const dueDate = new Date(r.due_date);

        // calculate initial balance
        for (dueDate; dueDate < localizedStartDate; dueDate.setMonth(dueDate.getMonth() + 1)) {
          if (paidRecurrence) {
            const paidDate = paidRecurrence.dates.find(d => d.getMonth() === dueDate.getMonth() && d.getFullYear() === dueDate.getFullYear());

            if (!paidDate) {
              if (r.type === "income")
                newInitialIncomes += r.amount;

              else
                newInitialExpenses += r.amount;
            }
          }

          else if (shouldRecurrenceShow(r.due_date, dueDate, r.recurrence_period)) {
            if (r.type === "income")
              newInitialIncomes += r.amount;

            else
              newInitialExpenses += r.amount;
          }
        }

        // calculate foreseen balance
        if (shouldRecurrenceShow(r.due_date, date, r.recurrence_period)) {
          const paidDate = paidRecurrence && paidRecurrence.dates.find(d => d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear());

          if (!paidDate) {
            if (r.type === "income")
              newForeseenIncomes += r.amount;

            else
              newForeseenExpenses += r.amount;
          }
        }
      })

      newBalanceIncomes += newInitialIncomes;
      newBalanceExpenses += newInitialExpenses;
      newForeseenIncomes += newBalanceIncomes;
      newForeseenExpenses += newBalanceExpenses;

      setInitial(newInitialIncomes - newInitialExpenses);
      setBalance(newBalanceIncomes - newBalanceExpenses)
      setForeseen(newForeseenIncomes - newForeseenExpenses);
    }
  }, [transactions, recurrences, date])

  return (
    <h1 className="balance">
      <div className="balance__data balance__side">
        <div className={`balance__label ${initial < 0 ? "balance__label--negative": ""}`}>
          Initial
        </div>

        <div className={`balance__value ${initial < 0 ? "balance__value--negative": ""}`}>
          { BRL.format(initial) }
        </div>
      </div>
      
      <div className="balance__data balance__center">
        <div className={`balance__label ${balance < 0 ? "balance__label--negative": ""}`}>
          Balance
        </div>

        <div className={`balance__value ${balance < 0 ? "balance__value--negative": ""}`}>
        { BRL.format(balance) }
        </div>
      </div>

      <div className="balance__data balance__side">
        <div className={`balance__label ${foreseen < 0 ? "balance__label--negative": ""}`}>
          Foreseen
        </div>

        <div className={`balance__value ${foreseen < 0 ? "balance__value--negative": ""}`}>
        { BRL.format(foreseen) }
        </div>
      </div>
    </h1>
  )
}