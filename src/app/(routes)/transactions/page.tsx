import MonthTab from "@/app/components/LayoutClient/MonthTab/MonthTab"
// import { PageHeader } from "@/app/components/LayoutServer/Headers/Headers"
import { TransactionsControl, TransactionList } from "@/app/components/Transactions/Transactions";

export default async function TransactionsPage(): Promise<JSX.Element> {

  return (
    <div className="transactions">
      <div className="upper-section">
        <MonthTab/>
        {/* <PageHeader header="TRANSACTIONS"/> */}
      </div>

      <div className="transactions__container">
        <div className="transactions__header">          
          <div className="transactions__lists">
            <TransactionList type="income"/> 
            <TransactionList type="expense"/> 
          </div>
        </div>
      </div>
    </div>
  )
}