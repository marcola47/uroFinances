"use client";
import { FaReceipt, FaFilter, FaSort } from "react-icons/fa6"


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
    case "filter" : return <div className="transactions__control transactions__filter"  onClick={ handleFilter }  children={ <FaFilter/> } />
    case "sort"   : return <div className="transactions__control transactions__sort"    onClick={ handleSort }    children={ <FaSort/> }   />
    default: return <></>;
  }
}

export function Transaction(): JSX.Element {
  return (
    <div className="transaction">

    </div>
  )
}