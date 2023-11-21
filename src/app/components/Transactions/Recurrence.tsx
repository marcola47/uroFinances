"use client";
import { TRecurrence } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useTransactionsContext } from "@/app/context/Transactions";
import { useUIContext } from "@/app/context/Ui";
import { useDateContext } from "@/app/context/Date";

import getTextColor from "@/libs/helpers/getTextColor";
import { FaDollarSign, FaExclamation } from "react-icons/fa6";

export default function Transaction({ itemData: recurrence }: { itemData: TRecurrence }): JSX.Element {
  const { user } = useUserContext();
  const { setTransactions } = useTransactionsContext();
  const { setModalTransShown, setModalTransData } = useUIContext();
  const { date } = useDateContext();

  const BRL = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
  
  const recurrenceAccountName = user?.accounts.find(a => a.id === recurrence.account)?.name;
  
  type RecurrenceCategoryProps = {
    root:       { id?: string, name?: string, style: { backgroundColor?: string, color?: string } },
    child:      { id?: string, name?: string, style: { backgroundColor?: string, color?: string } },
    grandchild: { id?: string, name?: string, style: { backgroundColor?: string, color?: string } },
  }
  
  const recurrenceCategory: RecurrenceCategoryProps = {
    root:       { name: undefined, style: { backgroundColor: undefined, color: undefined } },
    child:      { name: undefined, style: { backgroundColor: undefined, color: undefined } },
    grandchild: { name: undefined, style: { backgroundColor: undefined, color: undefined } }
  };
  
  for (const key in recurrenceCategory) { 
    const transKey = key as keyof typeof recurrenceCategory;
    
    if (recurrence.category[transKey] !== null) {
      const category = user?.categories.find(category => category.id === recurrence.category[transKey]);
      
      recurrenceCategory[transKey].id = category?.id;
      recurrenceCategory[transKey].name = category?.name;
      recurrenceCategory[transKey].style = {
        backgroundColor: category?.color, 
        color: (category?.color && getTextColor(category?.color)) ?? undefined
      };
    }
  }

  const formattedRecurrencePeriod = recurrence.recurrence_period 
    ? recurrence.recurrence_period.charAt(0).toUpperCase() + recurrence.recurrence_period.slice(1) 
    : null;
  
  async function handleConfirmRecurrence(e: any) {
    e.stopPropagation();
    
    const curDate = new Date(date);
    const dueDate = new Date(recurrence.due_date);
    dueDate.setFullYear(curDate.getFullYear());
    dueDate.setMonth(curDate.getMonth());

    const res = await fetch(`/api/recurrences/confirm/${recurrence.id}`, {
      method: "POST",
      headers: { "type": "application/json" },
      body: JSON.stringify({
        due_date: dueDate,
        confirmation_date: new Date()
      })
    });

    const { status, err, data } = await res.json();

    if (status < 200 || status >= 400) 
      console.log(err);

    else 
      setTransactions(prevTransactions => [...prevTransactions, data]);
  }

  function handleShowmodalTrans() {
    setModalTransShown(true);
    setModalTransData({ ...recurrence, operation: 'PUT' });
  }

  return (
    <div 
      className="transaction"
      onClick={ handleShowmodalTrans }
    >
      <div className={`transaction__indicator ${recurrence.type === 'income' ? "transaction__indicator--income" : "transaction__indicator--expense"}`}>
        {
          recurrence.type === "income"
          ? <FaDollarSign className="transaction__indicator__icon transaction__indicator__icon--green"/>
          : <FaDollarSign className="transaction__indicator__icon transaction__indicator__icon--green"/>
        }
      </div>

      <div className="transaction__content">
        <div className="transaction__name">
          { recurrence.name }
        </div>
        
        <div className="transaction__info">
          <div className="transaction__account">
            { recurrenceAccountName }
          </div>

          <div className="transaction__due-date">
            {`${String(new Date(recurrence.due_date).getDate()).padStart(2, '0')}/${String(new Date(date).getMonth() + 1).padStart(2, '0')}`}
          </div>

          <div className="transaction__recurrance">
            { formattedRecurrencePeriod }
          </div>
        </div>

        <div className="transaction__categories">
          <div 
            className="transaction__category"
            style={ recurrenceCategory.root.style }
          > { recurrenceCategory.root.name }
          </div>
    
          {
            recurrence.category.child &&
            <div 
              className="transaction__category"
              style={ recurrenceCategory.child.style }
            > { recurrenceCategory.child.name }
            </div>
          }

          {
            recurrence.category.grandchild &&
            <div 
              className="transaction__category"
              style={ recurrenceCategory.grandchild.style }
            > { recurrenceCategory.grandchild.name }
            </div>
          }
        </div>
      </div>

      <div className="transaction__status">
        <div className="transaction__amount">
          { BRL.format(recurrence.amount) }
        </div>

        <div 
          className="transaction__toggle transaction__toggle--unconfirmed"
          onClick={ (e) => {handleConfirmRecurrence(e)} }
        > <FaExclamation className="transaction__toggle__icon"/>
        </div>
      </div>
    </div>
  )
}