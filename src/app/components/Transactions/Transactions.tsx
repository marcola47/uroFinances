"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDateContext } from "@/app/context/Date";
import { FaReceipt, FaFilter, FaSort } from "react-icons/fa6"
import List from "../List/List";

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

export function Transaction(): JSX.Element {
  return (
    <div className="transaction">

    </div>
  )
}

export function TransactionList({ type }: { type: string }): JSX.Element {
  type Transaction = {
    id: string,
    name: string,
    user: string,
    account: string,
    type: string,
    amount: number,
    registration_date: Date,
    due_date: Date,
    confirmed: boolean,
    recurring: boolean | null,
    recurring_period: string | null,
    recurring_months: number[] | null,
    recurring_months_paid: [{
      due_month: Date,
      paid_month: Date
    }],
    in_stallments: boolean | null,
    in_stallments_count: number | null,
    in_stallments_current: number | null,
    category: {
      root: string,
      child: string | null,
      grandchild: string | null
    }
  }; const [transactions, setTransactions] = useState<Transaction[]>([]);

  const { data: session } = useSession();
  const { date } = useDateContext();

  async function getTransactions() {
    const res = await fetch(`/api/transactions?user=${session?.user?.id}&date=${date}&type=${type}`, {
      method: "GET",
      headers: { "type": "application/json" }
    });

    const { err, data } = await res.json();
    console.log(data);

    if (err)
      console.log(err);
  }

  useEffect(() => { getTransactions()  }, [type, date])

  return (
    <div className="transaction-list">

    </div>
  )
}