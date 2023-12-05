"use client";
import { useState, useEffect } from "react";

import { useTransactionsContext } from "./context/Transactions";
import { useDateContext } from "./context/Date";

import Navbar from "./components/Navbar/Navbar";
import MonthTab from "./components/MonthTab/MonthTab";
import { getMonthRange, applyTimeZoneOffset } from "@/libs/helpers/dateFunctions";
import { set } from "mongoose";

export default function App(): JSX.Element {
  const { transactions, recurrences } = useTransactionsContext();
  const { date } = useDateContext();
  
  const [initial, setInitial] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [foreseen, setForeseen] = useState<number>(0);

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  useEffect(() => {
    //initial balance
    //-- calculate all transactions that have a confirmation date before the current month

    //balance
    //-- get initial and add all confirmed transactions/recurrences so far

    //foreseen
    //-- get balance and all transactions and recurrences that have a due date in the current month


    if (transactions.length > 0 || recurrences.length > 0) {
      const { startDate, endDate } = getMonthRange(new Date(date));
      const localizedStartDate = applyTimeZoneOffset(startDate);
      const localizedEndDate = applyTimeZoneOffset(endDate);

      let confirmedTransactions: TTransaction[] = [];
      let foreseenTransactions: TTransaction[] = [];
      transactions.forEach(t => { (t.confirmation_date) ? confirmedTransactions.push(t) : foreseenTransactions.push(t) })
      
      let newInitialIncomes = 0;
      let newInitialExpenses = 0;
      let newBalanceIncomes = 0;
      let newBalanceExpenses = 0;
      let newForeseenIncomes = 0;
      let newForeseenExpenses = 0;

      transactions.forEach(t => {
        const confirmationDate = t.confirmation_date && new Date(t.confirmation_date);
        const dueDate = new Date(t.due_date);

        if (confirmationDate) {
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

      newBalanceIncomes += newInitialIncomes;
      newBalanceExpenses += newInitialExpenses;
      newForeseenIncomes += newBalanceIncomes;
      newForeseenExpenses += newBalanceExpenses;

      setInitial(newInitialIncomes - newInitialExpenses);
      setBalance(newBalanceIncomes - newBalanceExpenses)
      setForeseen(newForeseenIncomes - newForeseenExpenses);
    }
  }, [transactions, recurrences, date])

  // useEffect(() => { console.log(initial) }, [initial])
  
  function HeaderBalance(): JSX.Element {    
    return (
      <h1 className="home__balance">
        <div className="home__balance__data home__balance__side">
          <div className={`home__balance__label ${initial < 0 ? "home__balance__label--negative": ""}`}>
            Initial
          </div>

          <div className={`home__balance__value ${initial < 0 ? "home__balance__value--negative": ""}`}>
            { BRL.format(initial) }
          </div>
        </div>
        
        <div className="home__balance__data home__balance__center">
          <div className={`home__balance__label ${balance < 0 ? "home__balance__label--negative": ""}`}>
            Balance
          </div>

          <div className={`home__balance__value ${balance < 0 ? "home__balance__value--negative": ""}`}>
          { BRL.format(balance) }
          </div>
        </div>
  
        <div className="home__balance__data home__balance__side">
          <div className={`home__balance__label ${foreseen < 0 ? "home__balance__label--negative": ""}`}>
            Foreseen
          </div>

          <div className={`home__balance__value ${foreseen < 0 ? "home__balance__value--negative": ""}`}>
          { BRL.format(foreseen) }
          </div>
        </div>
      </h1>
    )
  }

  return (
    <div className="app">
      <Navbar/>
      <div className="page home">
        <div className="page__top">
          <MonthTab/>
          <HeaderBalance/>
        </div>
      </div>
    </div>
  )
}