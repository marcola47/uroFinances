"use client";
import { useUserContext } from "@/app/context/User";
import { useTransactionsContext } from "@/app/context/Transactions";
import { useUIContext } from "@/app/context/Ui";

import getTextColor from "@/libs/helpers/getTextColor";
import { FaDollarSign, FaCheck, FaExclamation } from "react-icons/fa6";

export default function Transaction({ itemData: transaction }: { itemData: TTransaction }): JSX.Element {
  const { user } = useUserContext();
  const { transactions, setTransactions, recurrences } = useTransactionsContext();
  const { setModalTrans } = useUIContext();
  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  
  const transactionAccountName = user?.accounts.find(a => a.id === transaction.account)?.name;
  const transactionRecurrencePeriod = transaction.recurrence
  ? recurrences.find(r => r.id === transaction.recurrence)?.recurrence_period
  : null

  type TransactionCategoryProps = {
    root:       { id?: string, name?: string, style: { backgroundColor?: string, color?: string } },
    child:      { id?: string, name?: string, style: { backgroundColor?: string, color?: string } },
    grandchild: { id?: string, name?: string, style: { backgroundColor?: string, color?: string } },
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
      
      transactionCategory[transKey].id = category?.id;
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
  const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(dueDate);
  
  const formattedRecurrence = transaction.stallments_period 
    ? transaction.stallments_period.charAt(0).toUpperCase() + transaction.stallments_period.slice(1) 
    : null;
  
  async function handleConfirmTransaction(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    let transactionsCopy = structuredClone(transactions);

    if (transaction.recurrence)
      transactionsCopy = transactionsCopy.filter(t => t.id !== transaction.id);

    else if (transaction.confirmation_date)
      transactionsCopy.map(t => { t.id === transaction.id && (t.confirmation_date = null) });

    else
      transactionsCopy.map(t => { t.id === transaction.id && (t.confirmation_date = new Date()) });

    const res = await fetch(`/api/transactions/confirm/${transaction.id}`, {
      method: "PUT",
      headers: { "type": "application/json" },
      body: JSON.stringify({ 
        recurrence: transaction.recurrence,
        confirmation_date: transaction.confirmation_date ? null : new Date()
      })
    });
    
    const { status, err } = await res.json();
    
    if (status < 200 || status >= 400) 
    console.log(err);
  
    else 
      setTransactions(transactionsCopy);
  }

  return (
    <div 
      className="transaction"
      onClick={ () => {setModalTrans({ ...transaction, operation: 'PUT' })} }
    >
      <div className={`transaction__indicator ${transaction.type === 'income' ? "transaction__indicator--income" : "transaction__indicator--expense"}`}>
        {
          transaction.type === "income"
          ? <FaDollarSign className="transaction__indicator__icon transaction__indicator__icon--green"/>
          : <FaDollarSign className="transaction__indicator__icon transaction__indicator__icon--green"/>
        }
      </div>

      <div className="transaction__content">
        <div className="transaction__name">
          { 
            transaction.stallments 
            ? `${transaction.name} ${transaction.stallments_current}/${transaction.stallments_count}`
            : transaction.name
          }
        </div>
        
        <div className="transaction__info">
          <div className="transaction__account">
            { transactionAccountName }
          </div>

          <div className="transaction__due-date">
            { formattedDate.replace(",", "") }
          </div>

          {
            transaction.stallments_period &&
            <div className="transaction__recurrance">
              { formattedRecurrence }
            </div>
          }

          {
            transactionRecurrencePeriod &&
            <div className="transaction__recurrance">
              { transactionRecurrencePeriod?.charAt(0).toUpperCase() + transactionRecurrencePeriod?.slice(1) }
            </div>
          }
        </div>

        {
          transaction.category.root &&
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
        }
      </div>

      <div className="transaction__status">
        <div className="transaction__amount">
          { BRL.format(transaction.amount) }
        </div>

        <div 
          className={`transaction__toggle ${transaction.confirmation_date ? "transaction__toggle--paid" : "transaction__toggle--unpaid"}`}
          onClick={ (e) => {handleConfirmTransaction(e)} }
        >
          {
            transaction.confirmation_date
            ? <FaCheck className="transaction__toggle__icon"/>
            : <FaExclamation className="transaction__toggle__icon"/>
          }
        </div>
      </div>
    </div>
  )
}