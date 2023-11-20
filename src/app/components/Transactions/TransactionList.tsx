"use client";
import { useState, useEffect, useRef } from "react";

import { TTransaction, TRecurrence } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";

import List from "../List/List";
import { HeaderLineTh } from "../LayoutServer/Headers/Headers";
import Transaction from "./Transaction";
import TransactionsControl from "./TransactionsControls";

interface TransactionListProps {
  transactions: TTransaction[];
  recurrences: TRecurrence[];
  type: "income" | "expense";
}

export default function TransactionList({ transactions, recurrences, type }: TransactionListProps): JSX.Element {
  const { user } = useUserContext();
  const { setModalTransShown, setModalTransData } = useUIContext();
  const [height, setHeight] = useState<number>(0);

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const transactionsRef = useRef<HTMLDivElement>(null);

  let transactionsTotal = 0;
  transactions.forEach(t => { t.confirmed && (transactionsTotal += t.amount) })

  // useEffect(() => { console.log(recurrences) }, [recurrences])

  useEffect(() => {
    function calculateDistances() {
      const element = transactionsRef.current;
      console.log(element)
      
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

  function handleShowModalTrans() {
    setModalTransShown(true);
    setModalTransData({ type: type, operation: "create" });
  }

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

      <div 
        className={`transactions__list ${user?.settings?.hide_scrollbars ? "hide-scrollbar" : ""}`}
        id="transactions__list"
        style={{ height: height }}
        ref={ transactionsRef }
      >
        <List 
          elements={ transactions }
          ListItem={ Transaction }
          unwrapped={ true }
        />

        <HeaderLineTh header="Test"/>
      </div>

      {/* <List
        className="transactions__list"
        id={`list:transactions:${type}`}
        elements={ transactions }
        ListItem={ Transaction }
        style={{ height: height }}
        forwardedRef={ transactionsRef }
      /> */}

      <button 
        className={`btn btn--full ${type === 'income' ? "btn--bg-green" : "btn--bg-red"}`}
        onClick={ handleShowModalTrans }
        children={`ADD ${type.toUpperCase()}`}
      />
    </div>
  )
}
