"use client";
import { useState, useEffect, useRef } from "react";
import { TypeTransaction } from "@/types/types";

import List from "../List/List";
import Transaction from "./Transaction";
import TransactionAdd from "./TransactionAdd";
import TransactionsControl from "./TransactionsControls";

interface TransactionListProps {
  transactions: TypeTransaction[];
  type: string;
}

export function TransactionList({ transactions, type }: TransactionListProps): JSX.Element {
  const [height, setHeight] = useState<number>(0);

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const transactionsRef = useRef<HTMLUListElement>(null);

  let transactionsTotal = 0;
  transactions.forEach(t => { t.confirmed && (transactionsTotal += t.amount) })

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
          <TransactionsControl type="filter"/>
          <TransactionsControl type="sort"/>
        </div>
      </div>
      
      <List
        className="transactions__list"
        id={`list:transactions:${type}`}
        elements={ transactions }
        ListItem={ Transaction }
        style={{ height: height }}
        forwardedRef={ transactionsRef }
      />

      <TransactionAdd type={ type }/>
    </div>
  )
}