"use client";
import { useState, useEffect, useRef, forwardRef } from "react";
import { useSession } from "next-auth/react";

import getTextColor from "@/libs/helpers/getTextColor";
import { TypeTransaction } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useDateContext } from "@/app/context/Date";

import { FaReceipt, FaFilter, FaSort } from "react-icons/fa6"
import List from "../List/List";

export function Transaction({ itemData: transaction }: { itemData: TypeTransaction }): JSX.Element {
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const { user } = useUserContext();
  
  const transactionAccountName = user?.accounts.find(account => account.id === transaction.account)?.name;
  const transactionCategory = {
    root: { name: undefined, style: { backgroundColor: undefined, color: undefined } },
    child: { name: undefined, style: { backgroundColor: undefined, color: undefined } },
    grandchild: { name: undefined, style: { backgroundColor: undefined, color: undefined} }
  } 

  for (const key in transactionCategory) {    
    if (transaction.category[key as keyof typeof transactionCategory] !== null) {
      const category = user?.categories.find(category => category.id === transaction.category[key as keyof typeof transactionCategory]);
      transactionCategory[key as keyof typeof transactionCategory].name = category?.name;
      transactionCategory[key as keyof typeof transactionCategory].style = {
        backgroundColor: category?.color, 
        color: (category?.color && getTextColor(category?.color)) ?? undefined
      };
    }
  }

  const dateOptions = { 
    year: "numeric", 
    month: "2-digit",
    day: "2-digit" , 
    hour: "2-digit", 
    minute: "2-digit",
    hour12: false
  } as const;
  
  const dueDate = new Date(transaction.due_date);
  const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(dueDate);
  
  return (
    <div className="transaction">
      <div className="transaction__name">
        { transaction.name }
      </div>
      
      <div className="transaction__info">
        <div className="transaction__account">
          { transactionAccountName }
        </div>

        <div className="transaction__due-date">
          { formattedDate.replace(",", "") }
        </div>

        {
          transaction.recurring &&
          <div className="transaction__recurrance">
            { transaction.recurring_period }
          </div>
        }
      </div>

      <div className="transaction__categories">
        <div 
          className="transaction__category"
          style={ transactionCategory.root.style }
        > { transactionCategory.root.name }
        </div>

        {
          transaction.category.child &&
          <div className="transaction__category">
            { transactionCategory.child.name }
          </div>
        }

        {
          transaction.category.grandchild &&
          <div className="transaction__category">
            { transactionCategory.grandchild.name }
          </div>
        }
        </div>

        <div className="transaction__status">
          <div className="transaction__amount">
            { BRL.format(transaction.amount) }
          </div>
        </div>
    </div>
  )
}

export function TransactionList({ type }: { type: string }): JSX.Element {
  const [transactions, setTransactions] = useState<TypeTransaction[]>([]);
  const [height, setHeight] = useState<number>(0);

  const { data: session } = useSession();
  const { date } = useDateContext();

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const transactionsRef = useRef<HTMLUListElement>(null);

  useEffect(() => { 
    async function getTransactions() {
      const res = await fetch(`/api/transactions?user=${session?.user?.id}&date=${date}&type=${type}`, {
        method: "GET",
        headers: { "type": "application/json" }
      });
  
      const { status, err, data } = await res.json();
      
      if (status !== 200)
        console.log(err);
    
      else
        setTransactions(data);
    }
    
    getTransactions();
  }, [date])
  
  useEffect(() => {
    const calculateDistances = () => {
      const element = transactionsRef.current;
      
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementHeight = window.innerHeight - rect.bottom - 80;
        
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
          { BRL.format(transactions.reduce((acc, cur) => acc + cur.amount, 0)) }
        </h3>

        <div className="transactions__controls">
          <TransactionsControl type="invoice"/>
          <TransactionsControl type="filter"/>
          <TransactionsControl type="sort"/>
        </div>
      </div>
      
      <List
        className="transactions__list"
        ids={`list:transactions:${type}`}
        elements={ transactions }
        ListItem={ Transaction }
        style={{ height: height }}
        forwardedRef={ transactionsRef }
      />

      <TransactionAdd type={ type }/>
    </div>
  )
}

export function TransactionsControl({ type }: { type: string }): JSX.Element {
  function handleInvoice() {
    console.log("invoice");
    return;
  }

  function handleFilter() {
    console.log("filter");
    return;
  }

  function handleSort() {
    console.log("sort");
    return;
  }

  switch (type) {
    case "invoice": return <div className="transactions__control transactions__invoice" onClick={ handleInvoice } children={ <FaReceipt/> }/>
    case "filter" : return <div className="transactions__control transactions__filter " onClick={ handleFilter  } children={ <FaFilter/>  }/>
    case "sort"   : return <div className="transactions__control transactions__sort   " onClick={ handleSort    } children={ <FaSort/>    }/>
    default: return <></>;
  }
}

export function TransactionAdd({ type }: { type: string }): JSX.Element {
  const className = type === 'income'
    ? "btn btn--full btn--bg-green"
    : "btn btn--full btn--bg-red"
  
  function handleAddTransaction() {
    return true;
  }

  return (
    <button 
      className={ className }
      onClick={ handleAddTransaction }
      children={`ADD ${type.toUpperCase()}`}
    />
  )
}