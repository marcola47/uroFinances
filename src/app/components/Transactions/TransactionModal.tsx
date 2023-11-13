import { useState, useEffect, useRef } from "react";

import { TUUID, TTransactionType, TTransactionCategory, TRecurringPeriod, TRecurringPaidMonths } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import { FaXmark, FaAlignLeft, FaDollarSign, FaClock } from "react-icons/fa6";

export default function TransactionModal(): JSX.Element {
  const { user } = useUserContext();
  const { setTransactionModalShown, transactionModalData, setTransactionModalData } = useUIContext();
  const [clockShown, setClockShown] = useState<boolean>(false);
  
  const [newID, setNewID] = useState<TUUID>(transactionModalData!.id ?? null);
  const [newName, setNewName] = useState<string>(transactionModalData!.name ?? "");
  const [newUser, setNewUser] = useState<TUUID>(transactionModalData!.user ?? user!.id);
  const [newAccount, setNewAccount] = useState<TUUID>(transactionModalData!.account ?? null);
  const [newType, setNewType] = useState<TTransactionType>(transactionModalData!.type ?? "expense");
  const [newAmount, setNewAmount] = useState<string | null>(transactionModalData!.amount ? transactionModalData!.amount.toString() : null);
  const [newDueDate, setNewDueDate] = useState<Date>(transactionModalData!.due_date ? new Date(transactionModalData!.due_date) : new Date());
  const [newConfirmed, setNewConfirmed] = useState<boolean>(transactionModalData!.confirmed ?? false);
  const [newRecurring, setNewRecurring] = useState<boolean>(transactionModalData!.recurring ?? false);
  const [newRecurringMonths, setNewRecurringMonths] = useState<number[] | null>(transactionModalData!.recurring_months ?? null);
  const [newInStallments, setNewInStallments] = useState<boolean>(transactionModalData!.in_stallments ?? false);
  const [newInstallmentsCount, setNewInstallmentsCount] = useState<number | null>(transactionModalData!.in_stallments_count ?? null);
  const [newInStallmentsCurrent, setNewInStallmentsCurrent] = useState<number | null>(transactionModalData!.in_stallments_current ?? null);
  const [newCategory, setNewCategory] = useState<TTransactionCategory | null>(transactionModalData!.category ?? null);

  let modalDesc = "";
  switch (transactionModalData!.modalType) {
    case "income": modalDesc = "ADD INCOME"; break;
    case "expense": modalDesc = "ADD EXPENSE"; break;
    case "existing": modalDesc = "EDIT TRANSACTION"; break;
  }

  // useEffect(() => { if (date) console.log(`date: ${date}`) }, [date])
  // useEffect(() => { if (time) console.log(`time: ${time}`) }, [time])
  useEffect(() => { if (newDueDate) console.log(`newDueDate: ${newDueDate.toISOString()}`) }, [newDueDate])
  // useEffect(() => { console.log(transactionModalData) }, [])
  
  function handleHideTransactionModal() {
    setTransactionModalShown(false);
    setTransactionModalData(null);
  }

  function handleSetNewTime(newTime: Date) {
    setNewDueDate(newTime);
    setClockShown(false);
  }

  function handleSetTransaction() {
    if (!newName) return alert("Name is required");
    if (!newAmount) return alert("Amount is required");

    const newTransaction = {
      id: newID,
      name: newName,
      user: newUser,
      account: newAccount,
      type: newType,
      amount: parseInt(newAmount.replace(/[\D]+/g,'')),
      registration_date: new Date(),
      due_date: newDueDate,
      confirmed: newConfirmed,
      recurring: newRecurring,
      recurring_months: newRecurringMonths,
      in_stallments: newInStallments,
      installments_count: newInstallmentsCount,
      in_stallments_current: newInStallmentsCurrent,
      category: newCategory
    }

    console.log(newTransaction);
  }

  
  return (
    <div 
      className="modal-bg"
      onClick={ handleHideTransactionModal }
    >
      <div 
        className="transaction-modal"
        onClick={ (e) => e.stopPropagation() }
      >
        <div className="transaction-modal__header">
          <FaXmark 
            className="transaction-modal__close" 
            onClick={ handleHideTransactionModal }
          />

          <h1 className="transaction-modal__title">
            { modalDesc }
          </h1>
        </div>

        <div className="transaction-modal__form">
          <div className="transaction-modal__row transaction-modal__row--0">
            <div className="transaction-modal__input transaction-modal__input--name">
              <FaAlignLeft className="transaction-modal__icon"/>
              <input 
                type="text" 
                className="transaction-modal__field"
                placeholder="Name"
                value={ newName }
                onChange={ (e) => {setNewName(e.target.value)} }
              />
            </div>

            <div className="transaction-modal__input transaction-modal__input--amount">
              <FaDollarSign className="transaction-modal__icon"/>
              <input
                type="tel" 
                className="transaction-modal__field"
                placeholder="Amount"
                value={ formatCurrency(newAmount) }
                onChange={ (e) => {setNewAmount(e.target.value)} }
              />
            </div>
          </div>

          <div className="transaction-modal__row transaction-modal__row--1">
            <LocalizationProvider dateAdapter={ AdapterDateFns }>
              <DatePicker 
                value={ newDueDate }
                onChange={ (newDate) => {setNewDueDate(newDate!)} }
              />

              <div 
                className="transaction-modal__input transaction-modal__input--time"
                onClick={ () => {setClockShown(!clockShown)} }
              >
                <FaClock className="transaction-modal__icon"/>
                <input
                  type="string" 
                  className="transaction-modal__field"
                  readOnly
                  value={`${String(newDueDate.getHours()).padStart(2, '0')}:${String(newDueDate.getMinutes()).padStart(2, '0')}`}
                  onChange={ (e) => {setNewAmount(e.target.value)} }
                />

                {
                  clockShown &&
                  <div 
                    className="transaction-modal__clock"
                    onClick={ (e) => {e.stopPropagation()}}
                  >
                    <StaticTimePicker 
                      ampm={ false }
                      defaultValue={ newDueDate }
                      onAccept={ (newTime) => {handleSetNewTime(newTime!)} }
                      onClose={ () => {setClockShown(false)} }
                    />
                  </div>
                }
              </div>
            </LocalizationProvider>
          </div>
        </div>
      </div>
    </div>
  )
}