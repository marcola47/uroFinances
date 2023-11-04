import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import MonthTab from "@/app/components/LayoutClient/MonthTab/MonthTab"
import PageHeader from "@/app/components/LayoutServer/PageHeader/PageHeader"
import { TransactionsControl, TransactionList } from "@/app/components/Transactions/Transactions";

export default async function TransactionsPage(): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);

  const res = await fetch(`http://localhost:3000/api/transactions/${session?.user?.id}`, {
    method: "GET",
    headers: { "type": "application/json" }
  });

  return (
    <div className="transactions">
      <div className="upper-section">
        <MonthTab/>
        <PageHeader header="TRANSACTIONS"/>
      </div>

      <div className="transactions__container">
        <div className="transactions__header">
          <div className="transactions__amount">
            <label>Incomes</label>
            <span>R$12.425,65</span>
          </div>
          <div className="transactions_controls">
            <TransactionsControl type="invoice"/>
            <TransactionsControl type="filter"/>
            <TransactionsControl type="sort"/>
          </div>

          <TransactionList type="income"/> 
        </div>
      </div>
    </div>
  )
}