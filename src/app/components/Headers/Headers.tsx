import { useTransactionsContext } from "@/app/context/Transactions"

export function HeaderPage({ header }: { header: string }): JSX.Element {
  return (
    <h1 className="header--page">
      { header }
    </h1>
  )
}

export function HeaderLineTh({ header }: { header: string }): JSX.Element {
  return (
    <h3 className="header--line-th">
      <div className="line"/>
      
      <div className="text">
        { header }
      </div>
    </h3>
  )
}