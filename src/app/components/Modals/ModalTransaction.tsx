import { useState, useEffect, useRef } from "react";

import { TUUID, TTransactionType, TTransactionCategory, TRecurringPeriod, TRecurringPaidMonths } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import { FaChevronDown, FaXmark, FaAlignLeft, FaDollarSign, FaClock, FaBuildingColumns } from "react-icons/fa6";

export default function ModalTrans(): JSX.Element {
  const { user } = useUserContext();
  const { setModalTransShown, modalTransData, setModalTransData } = useUIContext();
  const [clockShown, setClockShown] = useState<boolean>(false);
  const [modalDesc, setModalDesc] = useState<string>(".");

  const [newID, setNewID] = useState<TUUID>(modalTransData!.id ?? null);
  const [newName, setNewName] = useState<string>(modalTransData!.name ?? "");
  const [newAccount, setNewAccount] = useState<TUUID>(modalTransData!.account ?? "");
  const [newType, setNewType] = useState<TTransactionType>(modalTransData!.type ?? "expense");
  const [newAmount, setNewAmount] = useState<string | null>(modalTransData!.amount ? modalTransData!.amount.toString() : null);
  const [newDueDate, setNewDueDate] = useState<Date>(modalTransData!.due_date ? new Date(modalTransData!.due_date) : new Date());
  const [newConfirmed, setNewConfirmed] = useState<boolean>(modalTransData!.confirmed ?? true);
  const [newRecurring, setNewRecurring] = useState<boolean>(modalTransData!.recurring ?? false);
  const [newRecurringMonths, setNewRecurringMonths] = useState<number[] | null>(modalTransData!.recurring_months ?? null);
  const [newInStallments, setNewInStallments] = useState<boolean>(modalTransData!.in_stallments ?? false);
  const [newInstallmentsCount, setNewInstallmentsCount] = useState<number | null>(modalTransData!.in_stallments_count ?? null);
  const [newInStallmentsCurrent, setNewInStallmentsCurrent] = useState<number | null>(modalTransData!.in_stallments_current ?? null);
  const [newCategory, setNewCategory] = useState<TTransactionCategory | null>(modalTransData!.category ?? null);

  useEffect(() => {
    if (modalTransData!.modalType.includes("new")) {
      switch (newType) {
        case "income": setModalDesc("ADD INCOME"); break;
        case "expense": setModalDesc("ADD EXPENSE"); break;
      }
    }

    else {
      switch (newType) {
        case "income": setModalDesc("EDIT INCOME"); break;
        case "expense": setModalDesc("EDIT EXPENSE"); break;
      }
    }
  }, [newType])

  function handleHideModalTrans() {
    setModalTransShown(false);
    setModalTransData(null);
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
      user: user!.id,
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
      onClick={ handleHideModalTrans }
    >
      <div 
        className="modal--trans"
        onClick={ (e) => e.stopPropagation() }
      >
        <div className="modal--trans__header">
          <FaXmark 
            className="modal--trans__close" 
            onClick={ handleHideModalTrans }
          />

          <h1 className="modal--trans__title">
            { modalDesc }
          </h1>
        </div>

        <div className="modal--trans__form">
          <div className="modal--trans__row modal--trans__row--0">
            <div className="input input--name">
              <FaAlignLeft className="input__icon"/>
              <input 
                type="text" 
                className="input__field"
                placeholder="Name"
                value={ newName }
                onChange={ (e) => {setNewName(e.target.value)} }
              />
            </div>

            <div className="input input--amount">
              <FaDollarSign className="input__icon"/>
              <input
                type="tel" 
                className="input__field"
                placeholder="Amount"
                value={ formatCurrency(newAmount) }
                onChange={ (e) => {setNewAmount(e.target.value)} }
              />
            </div>
          </div>

          <div className="modal--trans__row modal--trans__row--1">
            <LocalizationProvider dateAdapter={ AdapterDateFns }>
              <DatePicker 
                value={ newDueDate }
                onChange={ (newDate) => {setNewDueDate(newDate!)} }
              />

              <div 
                className="input input--time"
                onClick={ () => {setClockShown(!clockShown)} }
              >
                <FaClock className="input__icon"/>
                <input
                  type="string" 
                  className="input__field"
                  readOnly
                  value={`${String(newDueDate.getHours()).padStart(2, '0')}:${String(newDueDate.getMinutes()).padStart(2, '0')}`}
                  onChange={ (e) => {setNewAmount(e.target.value)} }
                />

                {
                  clockShown &&
                  <div 
                    className="input__clock"
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

            <div className="input input--account">
              <FaBuildingColumns className="input__icon"/>
              <input 
                readOnly
                className="input__field"
                placeholder="Account"
                // value={ newAccount }
                // onChange={ (e) => {setNewName(e.target.value)} }
              />
              <FaChevronDown className="input__chevron"/>
            </div>
          </div>

          <div className="modal--trans__row modal--trans__row--2">
            {
              modalTransData!.modalType.includes("new") &&
              <div className="modal--trans__switches">
                <div 
                  className={`switch switch--income ${newType === 'income' ? 'switch--selected' : ''}`}
                  onClick={ () => {setNewType('income')} }
                  children="Income"
                />

                <div 
                  className={`switch switch--expense ${newType === 'expense' ? 'switch--selected' : ''}`}
                  onClick={ () => {setNewType('expense')} }
                  children="Expense"
                />
              </div>
            }

            <div 
              className={`toggle ${newConfirmed ? "toggle--toggled" : "toggle--untoggled"}`}
              onClick= { () => {setNewConfirmed(!newConfirmed)} }
            >
              <div className={`toggle__checkbox ${newConfirmed ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled"}`}/>
              
              <div className="toggle__label">
                { newConfirmed ? "Confirmed" : "Pending" }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}