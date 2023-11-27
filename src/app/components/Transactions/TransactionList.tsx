"use client";
import { useState, useEffect, useRef } from "react";

import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";
import { useDateContext } from "@/app/context/Date";

import List from "../List/List";
import { HeaderLineTh } from "../LayoutServer/Headers/Headers";
import Recurrence from "./Recurrence"
import Transaction from "./Transaction";
import TransactionsControl from "./TransactionsControls";

type TransactionListProps = {
  transactions: TTransaction[];
  recurrences: TRecurrence[];
  type: "income" | "expense";
};

export type FilterProps = string;

export type SortProps = {
  by: "name" | "amount" | "due_date" | "confirmation_date" | "category" | "account",
  order: "asc" | "desc"
};

export default function TransactionList({ transactions, recurrences, type }: TransactionListProps): JSX.Element {
  const { user } = useUserContext();
  const { date } = useDateContext();
  const { setModalTrans } = useUIContext();

  const [filter, setFilter] = useState<FilterProps>("");
  const [sort, setSort] = useState<SortProps>({ by: "due_date", order: "desc" });
  const [processedTransactions, setProcessedTransactions] = useState<TTransaction[]>(transactions);
  const [processedRecurrences, setProcessedRecurrences] = useState<TRecurrence[]>(recurrences);
  const [height, setHeight] = useState<number>(0);

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const transactionsRef = useRef<HTMLDivElement>(null);

  let transactionsTotal = 0;
  transactions.forEach(t => { t.confirmation_date && (transactionsTotal += t.amount) })

  useEffect(() => {
    function calculateDistances() {
      const element = transactionsRef.current;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementHeight = window.innerHeight - rect.bottom - 88;
        
        if (elementHeight > 0)
          setHeight(elementHeight);
      }
    };

    calculateDistances();
    window.addEventListener('scroll', calculateDistances);
    window.addEventListener('resize', calculateDistances);

    return () => {
      window.removeEventListener('scroll', calculateDistances);
      window.removeEventListener('resize', calculateDistances);
    };
  }, []);

  useEffect(() => {
    let sortedTransactions: TTransaction[] = [];
    let sortedRecurrences: TRecurrence[] = [];

    if (transactions.length > 0) {
      sortedTransactions = transactions.sort((a, b) => {
        const aValue = sort.by.includes("date") ? new Date(a[sort.by] as string) : a[sort.by];
        const bValue = sort.by.includes("date") ? new Date(b[sort.by] as string) : b[sort.by];

        if (aValue === null || aValue === undefined) 
          return sort.order === 'asc' ? -1 : 1;

        if (bValue === null || bValue === undefined) 
          return sort.order === 'asc' ? 1 : -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') 
          return sort.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);

        else if (typeof aValue === 'number' && typeof bValue === 'number') 
          return sort.order === 'asc' ? (aValue < bValue ? -1 : 1) : (bValue < aValue ? -1 : 1);

        else if (aValue instanceof Date && bValue instanceof Date) {
          return sort.order === 'asc' ? aValue.getTime() - bValue.getTime() : bValue.getTime() - aValue.getTime(); 
        }

        else 
          return 0;
      });
    }

    if (recurrences.length > 0) {
      sortedRecurrences = recurrences.sort((a, b) => {
        const aValue = sort.by.includes("date") || sort.by === 'confirmation_date' ? new Date(a.due_date) : a[sort.by];
        const bValue = sort.by.includes("date") || sort.by === 'confirmation_date' ? new Date(b.due_date) : b[sort.by];
    
        if (aValue === null || aValue === undefined) 
          return sort.order === 'asc' ? -1 : 1;

        if (bValue === null || bValue === undefined) 
          return sort.order === 'asc' ? 1 : -1;
    
        if (typeof aValue === 'string' && typeof bValue === 'string') 
          return sort.order === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);

        else if (typeof aValue === 'number' && typeof bValue === 'number') 
          return sort.order === 'asc' ? (aValue < bValue ? -1 : 1) : (bValue < aValue ? -1 : 1);
        
        else if (aValue instanceof Date && bValue instanceof Date) 
            return sort.order === 'asc' ? aValue.getDate() - bValue.getDate() : bValue.getDate() - aValue.getDate(); 
        
        else 
          return 0;
      });
    }

    setProcessedTransactions(sortedTransactions);
    setProcessedRecurrences(sortedRecurrences);
  }, [transactions, recurrences, date, sort, filter])

  return (
    <div className="transactions__group">
      <div className="transactions__header">
        <h4 className={`transactions__label ${type === "income" ? "transactions__label--green" : "transactions__label--red"}`}>
          { type === "income" ? "Incomes" : "Expenses" }
        </h4>

        <h3 className={`transactions__amount ${type === "income" ? "transactions__amount--green" : "transactions__amount--red"}`}>
          { BRL.format(transactionsTotal) }
        </h3>

        <div className="transactions__controls">
          <TransactionsControl type="invoice"/>
          
          <TransactionsControl 
            type="filter"
            filter={ filter }
            setFilter={ setFilter }
          />
          
          <TransactionsControl 
            type="sort"
            sort={ sort }
            setSort={ setSort }
          />
        </div>
      </div>

      <div 
        className={`transactions__list ${user?.settings?.hide_scrollbars ? "hide-scrollbar" : ""}`}
        id="transactions__list"
        style={{ height: height }}
        ref={ transactionsRef }
      >
        <List 
          elements={ processedTransactions }
          ListItem={ Transaction }
          unwrapped={ true }
        />

        {
          recurrences.length > 0 &&
          <>
            <HeaderLineTh header={`PENDING RECURRING ${type.toUpperCase()}S`}/>
            <List
              elements={ processedRecurrences }
              ListItem={ Recurrence }
              unwrapped={ true }
            />
          </>
        }
      </div>

      <button 
        className={`btn btn--full ${type === 'income' ? "btn--bg-green" : "btn--bg-red"}`}
        onClick={ () => {setModalTrans({ type: type, operation: "POST" })} }
      > {`ADD ${type.toUpperCase()}`}
      </button>
    </div>
  )
}
