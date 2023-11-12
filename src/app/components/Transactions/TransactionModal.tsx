import { DatePicker } from "@mui/x-date-pickers"

export default function TransactionModal({ type }: { type: string }): JSX.Element {
  return (
    <div className="transaction-modal">
      <DatePicker/>
    </div>
  )
}