"use client";
import { TTransaction } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useTransactionsContext } from "@/app/context/Transactions";

import getTextColor from "@/libs/helpers/getTextColor";
import { FaDollarSign, FaCheck, FaExclamation } from "react-icons/fa6";

export default function Transaction({ itemData: transaction }: { itemData: TTransaction }): JSX.Element {
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  const { transactions, setTransactions } = useTransactionsContext();
  const { user } = useUserContext();
  
  const transactionAccountName = user?.accounts.find(a => a.id === transaction.account)?.name;
  
  type TransactionCategoryProps = {
    root:       { name?: string, style: { backgroundColor?: string, color?: string } },
    child:      { name?: string, style: { backgroundColor?: string, color?: string } },
    grandchild: { name?: string, style: { backgroundColor?: string, color?: string } },
  }
  
  const transactionCategory: TransactionCategoryProps = {
    root:       { name: undefined, style: { backgroundColor: undefined, color: undefined } },
    child:      { name: undefined, style: { backgroundColor: undefined, color: undefined } },
    grandchild: { name: undefined, style: { backgroundColor: undefined, color: undefined } }
  };
  
  for (const key in transactionCategory) { 
    const transKey = key as keyof typeof transactionCategory;
    
    if (transaction.category[transKey] !== null) {
      const category = user?.categories.find(category => category.id === transaction.category[transKey]);
      
      transactionCategory[transKey].name = category?.name;
      transactionCategory[transKey].style = {
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
  
  const formattedDate = transaction.recurring
    ? `${dueDate.getDate().toString().padStart(2, '0')}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`
    : new Intl.DateTimeFormat('en-GB', dateOptions).format(dueDate);
  
  const formattedRecurrence = transaction.recurring_period 
    ? transaction.recurring_period.charAt(0).toUpperCase() + transaction.recurring_period.slice(1) 
    : null;
  
  async function handleConfirmTransaction() {
    const transactionsCopy = structuredClone(transactions);
    transactionsCopy.map(t => { t.id === transaction.id && (t.confirmed = !t.confirmed) })
    
    const res = await fetch(`/api/transactions/confirm/${transaction.id}`, {
      method: "PUT",
      headers: { "type": "application/json" },
      body: JSON.stringify({ confirmed: !transaction.confirmed })
    });

    const { status, err } = await res.json();

    if (status < 200 || status >= 400) 
      console.log(err);
    
    else 
      setTransactions(transactionsCopy);
  }

  return (
    <div className="transaction">
      <div className={`transaction__indicator ${transaction.type === 'income' ? "transaction__indicator--income" : "transaction__indicator--expense"}`}>
        {
          transaction.type === "income"
          ? <FaDollarSign className="transaction__indicator__icon transaction__indicator__icon--green"/>
          : <FaDollarSign className="transaction__indicator__icon transaction__indicator__icon--green"/>
        }
      </div>

      <div className="transaction__content">
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
              { formattedRecurrence }
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
            <div 
              className="transaction__category"
              style={ transactionCategory.child.style }
            > { transactionCategory.child.name }
            </div>
          }

          {
            transaction.category.grandchild &&
            <div 
              className="transaction__category"
              style={ transactionCategory.grandchild.style }
            > { transactionCategory.grandchild.name }
            </div>
          }
        </div>
      </div>

      <div className="transaction__status">
        <div className="transaction__amount">
          { BRL.format(transaction.amount) }
        </div>

        <div 
          className={`transaction__toggle ${transaction.confirmed ? "transaction__toggle--confirmed" : "transaction__toggle--unconfirmed"}`}
          onClick={ handleConfirmTransaction }
        >
          {
            transaction.confirmed 
            ? <FaCheck className="transaction__toggle__icon"/>
            : <FaExclamation className="transaction__toggle__icon"/>
          }
        </div>
      </div>
    </div>
  )
}