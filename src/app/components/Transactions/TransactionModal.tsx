import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

export default function TransactionModal(): JSX.Element {
  return (
    <div className="transaction-modal">
      <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <DatePicker/>
        <StaticTimePicker ampm={ false } />
      </LocalizationProvider>
    </div>
  )
}