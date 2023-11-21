"use client";
import { FilterProps, SortProps } from "./TransactionList";
import { FaReceipt, FaFilter, FaSort } from "react-icons/fa6";

type TransactionsControlProps = {
  type: "invoice" | "filter" | "sort";
  sort?: { by: string, order: "asc" | "desc" };
  setSort?: React.Dispatch<React.SetStateAction<SortProps>>;
  filter?: string;
  setFilter?: React.Dispatch<React.SetStateAction<string>>;
}

export default function TransactionsControl({ type, sort, setSort, filter, setFilter }: TransactionsControlProps): JSX.Element {
  
  function handleInvoice() {
    console.log("invoice");
    return;
  }

  function handleFilter() {
    console.log("filter");
    return;
  }

  function handleSort() {
    if (setSort !== undefined && sort !== undefined) 
      setSort({ by: "due_date", order: "asc" });
    
      return;
  }

  switch (type) {
    case "invoice": return <div className="transactions__control transactions__invoice" onClick={ handleInvoice } children={ <FaReceipt/> }/>
    case "filter" : return <div className="transactions__control transactions__filter " onClick={ handleFilter  } children={ <FaFilter/>  }/>
    case "sort"   : return <div className="transactions__control transactions__sort   " onClick={ handleSort    } children={ <FaSort/>    }/>
    default: return <></>;
  }
}