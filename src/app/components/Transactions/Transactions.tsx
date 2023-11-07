"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDateContext } from "@/app/context/Date";
import { FaReceipt, FaFilter, FaSort } from "react-icons/fa6"

import { TypeTransaction } from "@/types/types";

import List from "../List/List";
import { PageHeader } from "../LayoutServer/Headers/Headers";

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

export function Transaction({ itemData: transaction }: { itemData: TypeTransaction }): JSX.Element {

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
          { transaction.account }
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

        <div className="transaction__categories">
          <div className="transaction__category">
            { transaction.category.root }
          </div>

          {
            transaction.category.child &&
            <div className="transaction__category">
              { transaction.category.child }
            </div>
          }

          {
            transaction.category.grandchild &&
            <div className="transaction__category">
              { transaction.category.grandchild }
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export function TransactionList({ type }: { type: string }): JSX.Element {
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const [transactions, setTransactions] = useState<TypeTransaction[]>([]);
  const { data: session } = useSession();
  const { date } = useDateContext();

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

  useEffect(() => { getTransactions() }, [date])

  return (
    <div className="transactions__group">
      <div className="transactions__header">
        <h4 className="transactions__label">
          { type === "income" ? "Incomes" : "Expenses" }
        </h4>

        <h3 className="transactions__amount">
          { BRL.format(transactions.reduce((acc, cur) => acc + cur.amount, 0)) }
        </h3>
      </div>
      <List
        className="transactions__list"
        ids={`list:transactions:${type}`}
        elements={ transactions }
        ListItem={ Transaction }
        unwrapped={ false }
      />
    </div>
  )
}