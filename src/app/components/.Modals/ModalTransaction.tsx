// REFACTOR THIS ASAP
// fix dropdown list to be below the input

import { useState, useEffect } from "react";

import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";
import { useDateContext } from "@/app/context/Date";
import { useTransactionsContext } from "@/app/context/Transactions";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import List from "../List/List";
import { 
  FaChevronDown, 
  FaChevronUp,
  FaXmark, 
  FaAlignLeft, 
  FaDollarSign, 
  FaClock, 
  FaBuildingColumns,
  FaPlus, 
  FaMinus,
  FaTag, 
  FaCalendarDay, 
  FaCirclePlus 
} from "react-icons/fa6";

export default function ModalTrans(): JSX.Element {
  const { user } = useUserContext();
  const { transactions, setTransactions, recurrences, setRecurrences } = useTransactionsContext();
  const { modalTrans, setModalTrans, setModalWarning, setModalMultiSelect, setModalConfirmation } = useUIContext();
  const { date } = useDateContext();
  
  const [dueClockShown, setDueClockShown] = useState<boolean>(false);
  const [confirmationClockShown, setConfirmationClockShown] = useState<boolean>(false);
  const [accountListShown, setAccountListShown] = useState<boolean>(false);
  const [categoryListShown, setCategoryListShown] = useState<string>("");
  const [recurringPeriodListShown, setRecurringPeriodListShown] = useState<boolean>(false);
  const [stallmentsPeriodListShown, setStallmentsPeriodListShown] = useState<boolean>(false);
  
  const [modalDesc, setModalDesc] = useState<string>(".");
  const [displayCategories, setDisplayCategories] = useState<TUserCategory[]>([]);
  const [stallmentsCountWarning, setStallmentsCountWarning] = useState<boolean>(false);
  const [updateType, setUpdateType] = useState<"current" | "future" | "all">(modalTrans!.recurrence_period ? "future" : "current");
  
  const [newID, setNewID] = useState<TUUID>(modalTrans!.id ?? undefined);
  const [newName, setNewName] = useState<string>(modalTrans!.name ?? "");
  const [newAccount, setNewAccount] = useState<TUUID>(modalTrans!.account ?? "");
  const [newType, setNewType] = useState<TFinancialEventType>(modalTrans!.type ?? "expense");
  const [newAmount, setNewAmount] = useState<string>(modalTrans!.amount ? (modalTrans!.amount).toFixed(2).toString() : "0");
  const [newRegDate, setNewRegDate] = useState<Date>(new Date(modalTrans?.reg_date ?? new Date()));
  const [newDueDate, setNewDueDate] = useState<Date>(new Date(modalTrans?.due_date ?? new Date()));
  const [newConfirmationDate, setNewConfirmationDate] = useState<Date>(new Date(modalTrans?.confirmation_date ?? new Date()));
  const [newCategory, setNewCategory] = useState<TFinancialEventCategory>(modalTrans!.category ?? { root: null, child: null, grandchild: null  });
  const [newRecurrence, setNewRecurrence] = useState<TUUID>(modalTrans!.recurrence ?? undefined);
  const [newRecurrencePeriod, setNewRecurrencePeriod] = useState<TFinancialEventPeriod | undefined>(modalTrans!.recurrence_period ?? undefined);
  const [newStallments, setNewStallments] = useState<TUUID>(modalTrans!.stallments ?? undefined);
  const [newStallmentsCount, setNewStallmentsCount] = useState<number>(modalTrans!.stallments_count ?? 1);
  const [newStallmentsCurrent, setNewStallmentsCurrent] = useState<number | undefined>(modalTrans!.stallments_current ?? undefined);
  const [newStallmentsPeriod, setNewStallmentsPeriod] = useState<TFinancialEventPeriod | undefined>(modalTrans!.stallments_period ?? undefined);
  
  const [isConfirmed, setIsConfirmed] = useState<boolean>(modalTrans!.confirmation_date ? true : false);
  const [isRecurring, setIsRecurring] = useState<boolean>(modalTrans!.recurrence || modalTrans?.recurrence_period ? true : false);
  const [isInStallments, setIsInStallments] = useState<boolean>(modalTrans!.stallments ? true : false);
  
  // used to determine if the user is updating the current transaction but changed data affecting multiple transactions
  const [originalRecurrencePeriod, setOriginalRecurrencePeriod] = useState<TFinancialEventPeriod | undefined>(undefined);
  const [originalRecurrenceDueDate, setOriginalRecurrenceDueDate] = useState<Date | undefined>(undefined);
  const [originalStallmentsCount, setOriginalStallmentsCount] = useState<number | undefined>(modalTrans!.stallments_count ?? 1);

  // must be objects to work with my List component
  const recurrencePeriods = [ 
    { name: "monthly" }, 
    { name: "quarterly" }, 
    { name: "semi-annual" }, 
    { name: "annual" } 
  ]

  // reset selected category, reset category list, set new modal description
  useEffect(() => {
    setDisplayCategories(user!.categories.filter(c => c.type === newType));
    
    if (newCategory !== modalTrans!.category)
      setNewCategory({ root: null, child: null, grandchild: null });

    if (modalTrans!.operation === "POST") {
      switch (newType) {
        case "income": setModalDesc("ADD INCOME"); break;
        case "expense": setModalDesc("ADD EXPENSE"); break;
      }
    }

    else {
      switch (newType) {
        case "income": setModalDesc(`EDIT ${modalTrans?.recurrence_period ? "RECURRING" : ""} INCOME`); break;
        case "expense": setModalDesc(`EDIT ${modalTrans?.recurrence_period ? "RECURRING" : ""} EXPENSE`); break;
      }
    }
  }, [newType])

  // adjust confirmed status when user changes due date in a new transactions
  useEffect(() => {
    const isNew = modalTrans?.operation === "POST" && newDueDate > new Date();
    const isExisting = modalTrans?.operation === "PUT" && !modalTrans.confirmation_date;

    if (isNew || isExisting) 
      setIsConfirmed(false);

    else 
      setIsConfirmed(true);
    
  }, [newDueDate])

  // If transaction is part of a recurrence, set the period and due date to the recurrence's
  useEffect(() => {
    if (newRecurrence) {
      const recurrence = recurrences.find(recurrence => recurrence.id === newRecurrence);

      if (recurrence) {
        setNewRecurrencePeriod(recurrence.recurrence_period);
        setOriginalRecurrencePeriod(recurrence.recurrence_period);

        setNewDueDate(new Date(recurrence.due_date));
        setOriginalRecurrenceDueDate(new Date(recurrence.due_date));
      }
    }
  }, [newRecurrence])

  // If user clicks on ADD outside of the current month, set the due_date as the context date
  useEffect(() => {
    const dueDate = new Date(newDueDate);
    const curDate = new Date(date);
    const isDifferentDate = dueDate.getMonth() !== curDate.getMonth() || dueDate.getFullYear() !== curDate.getFullYear();

    if (modalTrans?.operation === "POST" && isDifferentDate) {
      setNewDueDate(curDate);
      setNewConfirmationDate(curDate);
    }
  }, [date])
  
  function handleSetNewTime(newTime: Date, type: string) {
    if (type === "due") {
      setNewDueDate(newTime);
      setDueClockShown(false);
    }

    else if (type === "confirmation") {
      setNewConfirmationDate(newTime);
      setConfirmationClockShown(false);
    }

    else 
      throw new Error("Invalid date type")
  }

  // Warns the user about how changing the stallments count affects the transactions
  useEffect(() => {
    if (newStallmentsCount! > modalTrans!.stallments_count! && !stallmentsCountWarning) {
      setStallmentsCountWarning(true);
      setModalWarning({ 
        header: "Be careful when chaging the stallments count",
        message: "Increasing or decreasing the stallments count will create/delete transactions."
      })
    }
  }, [newStallmentsCount])

  function handleSetRecurrenceType(type: string) {
    if (type === "recurring" && !isRecurring) {
      setIsRecurring(true);
      setIsInStallments(false);
    }

    else if (type === "stallments" && !isInStallments) {
      setIsRecurring(false);
      setIsInStallments(true);
    }

    else {
      setIsRecurring(false);
      setIsInStallments(false);
    }
  }
  
  function handleSetStallmentsCount(type: string) {
    if (type === "increment")
      setNewStallmentsCount(newStallmentsCount + 1);

    else if (type === "decrement") {
      if (newStallmentsCount > 1)
        setNewStallmentsCount(newStallmentsCount - 1);
    
      else { // fix 
        setNewStallmentsCount(1);
        // setIsInStallments(false);
      }
    }
  }

  function toggleCategoryList(list: string) {
    if (categoryListShown === list)
      setCategoryListShown("");

    else
      setCategoryListShown(list);
  }

  // handles single transactions and updates of type "current"
  async function handleSetTransaction() {
    const newTransaction = {
      id: newID,
      name: newName,
      user: user!.id,
      account: newAccount,
      type: newType,
      category: newCategory,
      amount: parseFloat(newAmount.replace(/[\D]+/g,'')) / 100,
      reg_date: newRegDate,
      due_date: isRecurring ? modalTrans!.due_date : newDueDate,
      confirmation_date: isConfirmed ? newConfirmationDate : undefined,
    }

    const res = await fetch('/api/transactions', {
      headers: { type: "application/json" },
      method: modalTrans!.operation,
      body: JSON.stringify({ transaction: newTransaction })
    })

    const { error, data } = await res.json();
        
    if (error) {
      console.log(error);
      return;
    }

    if (modalTrans!.operation === "POST") {
      const transactionsCopy = [...transactions, data];
      setTransactions(transactionsCopy);
    }

    else if (modalTrans!.operation === "PUT") {
      const transactionsCopy = transactions.map(t => {
        if (t.id === data.id)
          return data;

        else 
          return t;
      })

      setTransactions(transactionsCopy);
    }
  }

  // handles stallments updates of type "future" and "all"
  async function handleSetStallments() {
    if (!newStallmentsPeriod) 
      return alert("Stallments period is required");

    if (!newStallmentsCount || newStallmentsCount === 0) 
      return alert("Stallments count is required");

    const newTransaction = {
      id: newID,
      name: newName,
      user: user!.id,
      account: newAccount,
      type: newType,
      category: newCategory,
      amount: parseFloat(newAmount.replace(/[\D]+/g,'')) / 100,
      reg_date: newRegDate,
      due_date: newDueDate,
      confirmation_date: isConfirmed ? newConfirmationDate : undefined,
      stallments: newStallments,
      stallments_count: newStallmentsCount,
      stallments_current: newStallmentsCurrent,
      stallments_period: newStallmentsPeriod,
    }

    if (modalTrans!.operation === "POST") {
      const res = await fetch('/api/stallments', {
        headers: { type: "application/json" },
        method: "POST",
        body: JSON.stringify({ transaction: newTransaction })
      })

      const { error, data } = await res.json();

      if (error) {
        console.log(error);
        return;
      }

      const transactionsCopy = [...transactions, ...data];
      setTransactions(transactionsCopy);
    }

    else if (modalTrans!.operation === "PUT") {
      const res = await fetch('/api/stallments', {
        headers: { type: "application/json" },
        method: "PUT",
        body: JSON.stringify({ 
          transaction: newTransaction,
          updateType: updateType,
        })
      })

      const { error, data } = await res.json();

      if (error) {
        console.log(error);
        return;
      }

      if (data.transactions.length > 0) {
        let transactionsCopy = transactions.map(transaction => {
          const matchingResTransaction = data.transactions.find((t: TTransaction) => t.id === transaction.id);
          return matchingResTransaction || transaction;
        });

        if (data.stallmentsForDeletion.length > 0)
          transactionsCopy = transactionsCopy.filter(t => !data.forDeletion.includes(t.id))

        if (data.stallmentsForInsertion.length > 0) 
          transactionsCopy = [...transactionsCopy, ...data.forInsertion];

        setTransactions(transactionsCopy);
      }
    }
  }

  // handles recurrence updates of type "future" and "all"
  async function handleSetRecurrence() {
    if (!newRecurrencePeriod)
      return alert("Recurrence period is required");
    
    // if newRecurrence exists, that means the data in the modal is from a transaction, not the recurrence itself
    const recurrence = {
      id: newRecurrence ? newRecurrence : newID,
      name: newName,
      user: user!.id,
      account: newAccount,
      type: newType,
      category: newCategory,
      amount: parseFloat(newAmount.replace(/[\D]+/g,'')) / 100,
      reg_date: newRegDate,
      due_date: newDueDate,
      recurrence_period: newRecurrencePeriod
    }

    const res = await fetch('/api/recurrences', {
      headers: { type: "application/json" },
      method: modalTrans!.operation,
      body: JSON.stringify({ 
        recurrence: recurrence,
        transaction: newRecurrence ? newID : undefined,
        curTransaction: newRecurrence ? newID : undefined,
        confirmationDate: isConfirmed ? newConfirmationDate : undefined,
        currentDate: date,
        updateType: updateType
      })
    })

    const { error, data } = await res.json();

    if (error) {
      console.log(error);
      return;
    }

    if (modalTrans?.operation === "POST") {
      setRecurrences(prevRecurrences => [...prevRecurrences, data.recurrence]);

      if (data.transaction)
        setTransactions(prevTransactions => [...prevTransactions, data.transaction]);
    }

    else if (modalTrans?.operation === "PUT") {
      if (data.recurrence) {
        const recurrencesCopy = recurrences.map(recurrence => {
          if (recurrence.id === data.recurrence.id)
            return data.recurrence;

          else 
            return recurrence;
        })

        setRecurrences(recurrencesCopy);
      }

      if (data.transactions.length > 0) {
        const transactionsCopy = transactions.map(transaction => {
          const matchingResTransaction = data.transactions.find((t: TTransaction) => t.id === transaction.id);
          return matchingResTransaction || transaction;
        });

        setTransactions(transactionsCopy);
      }
    }
  }

  async function handleSetFinancialEvent() {
    if (!newAmount || newAmount === "0" || newAmount === "0,00") 
      return alert("Amount is required");

    if (!newAccount)
      return alert("Account is required");

    if (!newName) 
      return alert("Name is required");

    if (modalTrans?.operation === "POST") {
      if (isRecurring) 
        await handleSetRecurrence();

      else if (isInStallments) 
        await handleSetStallments();

      else 
        await handleSetTransaction();
    }

    else if (modalTrans?.operation === "PUT") {
      if (updateType === "current") {
        if (isInStallments && originalStallmentsCount !== newStallmentsCount)
          await handleSetStallments();

        if (isRecurring) {
          const recurrencePeriodChanged = originalRecurrencePeriod !== newRecurrencePeriod;
          const dueDateChanged = originalRecurrenceDueDate && new Date(originalRecurrenceDueDate).getTime() !== new Date(newDueDate).getTime();

          if (recurrencePeriodChanged || dueDateChanged) {
            await handleSetRecurrence();
          }

          else
            await handleSetTransaction();
        }

        else
          await handleSetTransaction();
      }

      else {
        if (isRecurring) 
          await handleSetRecurrence();

        else if (isInStallments) 
          await handleSetStallments();
      }
    }

    setModalTrans(null);
  }

  async function handleDeleteTransaction() {
    const res = await fetch('/api/transactions', {
      headers: { type: "application/json" },
      method: "DELETE",
      body: JSON.stringify({ transaction: newID })
    })

    const { error, data } = await res.json();

    if (error) {
      console.log(error);
      return;
    }

    const transactionsCopy = transactions.filter(t => t.id !== data);
    setTransactions(transactionsCopy);
  }

  async function handleDeleteStallments(type: string) {
    if (type === "Current transaction")
      return handleDeleteTransaction();

    const res = await fetch('/api/stallments', {
      headers: { type: "application/json" },
      method: "DELETE",
      body: JSON.stringify({ 
        stallments: newStallments,
        currentCount: newStallmentsCurrent,
        deleteType: type
      })
    })

    const { error, data } = await res.json();

    if (error) {
      console.log(error);
      return;
    }

    const transactionsCopy = transactions.filter(t => !data.includes(t.id));
    setTransactions(transactionsCopy);
  }

  async function handleDeleteRecurrence(type: string) {
    if (type === "Current transaction")
      return handleDeleteTransaction();
    
    const res = await fetch('/api/recurrences', {
      headers: { type: "application/json" },
      method: "DELETE",
      body: JSON.stringify({ 
        recurrence: newRecurrence ? newRecurrence : newID,
        transaction: newRecurrence ? newID : undefined,
        deleteType: type
      })
    })

    const { error, data } = await res.json();

    if (error) {
      console.log(error);
      return;
    }

    if (data.transactions.length > 0) {
      const transactionsCopy = transactions.filter(t => !data.transactions.includes(t.id));
      setTransactions(transactionsCopy);
    }
    
    if (data.recurrence) {
      const recurrencesCopy = recurrences.filter(r => r.id !== data.recurrence);
      setRecurrences(recurrencesCopy);
    }
  }

  async function handleDeleteFinancialEvent() {
    if (isRecurring || isInStallments) {
      const options = (isRecurring && modalTrans?.recurrence) || isInStallments
      ? ["Current transaction", "Future transactions", "All transactions"]
      : ["Future transactions", "All transactions"]

      setModalMultiSelect({
        header: "Which transactions would you like to delete?",
        message: "This action is non-reversable.",
        options: options,
        type: "danger",
        onConfirm: (selected: string) => { isRecurring ? handleDeleteRecurrence(selected) : handleDeleteStallments(selected) },
        onCancel: () => { setModalTrans(null) }
      })
    }

    else {
      setModalConfirmation({
        header: "Are you sure you want to delete this transaction?",
        message: "This action is non-reversable.",
        type: "danger",
        onConfirm: () => { handleDeleteTransaction() },
        onCancel: () => { setModalTrans(null) }
      })
    }

    setModalTrans(null);
  }

  function ModalAccount({ itemData: account }: { itemData: TUserAccount }) {
    function handleSetNewAccount() {
      setNewAccount(account.id);
      setAccountListShown(false);
    }
    
    return (
      <div 
        className={`account ${newAccount === account.id ? "account--selected" : ""}`}
        onClick={ handleSetNewAccount }
      > 
        <div className="account__icon">
          <FaBuildingColumns/>
        </div>

        <div className="account__name">
          { account.name }
        </div>
      </div>
    )
  }

  function ModalCategory({ itemData: category }: { itemData: TUserCategory }) {
    const isCategorySelected =
      newCategory?.root === category.id ||
      newCategory?.child === category.id ||
      newCategory?.grandchild === category.id;

    function handleSetNewCategory() {
      if (!isCategorySelected) {
        if (category.grandparent) 
          setNewCategory({ root: newCategory?.root, child: newCategory?.child, grandchild: category.id });
         
        else if (category.parent) 
          setNewCategory({ root: newCategory?.root, child: category.id, grandchild: null });
         
        else 
          setNewCategory({ root: category.id, child: null, grandchild: null });
        
      }

      setCategoryListShown("");
    }

    return (
      <div
        className={`category ${isCategorySelected ? "category--selected" : ""}`}
        onClick={ handleSetNewCategory }
      >
        <div className="category__icon">
          <FaTag />
        </div>

        <div className="category__name">
          { category.name }
        </div>
      </div>
    );
  }

  function ModalUncategorized({ type }: { type: string }): JSX.Element {
    function handleSetUncategorized() {
      switch (type) {
        case "root": setNewCategory({ root: null, child: null, grandchild: null }); break;
        case "child": setNewCategory({ root: newCategory?.root, child: null, grandchild: null }); break;
        case "grandchild": setNewCategory({ root: newCategory?.root, child: newCategory?.child, grandchild: null }); break;
      }

      setCategoryListShown("");
    }
    
    return (
      <div
        className="category"
        onClick={ handleSetUncategorized }
      >
        <div className="category__icon">
          <FaXmark style={{ color: "hsl(0, 90%, 52%)" }}/>
        </div>

        <div className="category__name">
          Uncategorized
        </div>
      </div>
    );
  }
  
  // I could combine both these functions, but, I'm not really sure there is a need to
  function ModalRecurringPeriod({ itemData: recurrencePeriod }: { itemData: { name: TFinancialEventPeriod } }) {
    function handleSetNewRecurrencePeriod() {
      setNewRecurrencePeriod(recurrencePeriod?.name);
      setRecurringPeriodListShown(false);
    }
    
    return (
      <div 
        className={`recurring-period ${newRecurrencePeriod === recurrencePeriod?.name ? "recurring-period--selected" : ""}`}
        onClick={ handleSetNewRecurrencePeriod }
      > 
        <div className="recurring=period__name">
          { recurrencePeriod.name ? recurrencePeriod.name?.charAt(0).toUpperCase() + recurrencePeriod.name?.slice(1) : "" }
        </div>
      </div>
    )
  }

  // I could combine both these functions, but, I'm not really sure there is a need to
  function ModalStallmentsPeriod({ itemData: stallmentsPeriod }: { itemData: { name: TFinancialEventPeriod } }) {
    function handleSetNewStallmentsPeriod() {
      setNewStallmentsPeriod(stallmentsPeriod?.name);
      setStallmentsPeriodListShown(false);
    }
    
    return (
      <div 
        className={`recurring-period ${newStallmentsPeriod === stallmentsPeriod?.name ? "recurring-period--selected" : ""}`}
        onClick={ handleSetNewStallmentsPeriod }
      > 
        <div className="recurring=period__name"> 
          { stallmentsPeriod.name ? stallmentsPeriod.name?.charAt(0).toUpperCase() + stallmentsPeriod.name?.slice(1) : "" }
        </div>
      </div>
    )
  }

  return (
    <div 
      className="modal__bg"
      onClick={ () => {setModalTrans(null)} }
    >
      <div 
        className="modal--trans"
        onClick={ e => e.stopPropagation() }
      >
        <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <div className="modal--trans__header">
          <FaXmark 
            className="modal--trans__close" 
            onClick={ () => {setModalTrans(null)} }
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
                onChange={ e => {setNewName(e.target.value)} }
              />
            </div>

            <div className="input input--amount">
              <FaDollarSign className="input__icon"/>
              <input
                type="tel" 
                className="input__field"
                placeholder="Amount"
                value={ formatCurrency(newAmount) }
                onChange={ e => {setNewAmount(e.target.value)} }
              />
            </div>
          </div>

          <div className="modal--trans__row modal--trans__row--1">
            <div className="input__wrapper">
              <div className="input__label">
                { isRecurring ? "Recurrence Start Date" : "Due Date" }
              </div>

              <DatePicker 
                value={ newDueDate }
                onChange={ (newDate) => {setNewDueDate(newDate!)} }
              />
            </div>

            <div 
              className="input input--time"
              onClick={ () => {setDueClockShown(!dueClockShown)} }
            >
              <FaClock className="input__icon"/>
              <input
                type="string" 
                className="input__field"
                readOnly
                value={`${String(newDueDate.getHours()).padStart(2, '0')}:${String(newDueDate.getMinutes()).padStart(2, '0')}`}
                onChange={ e => {setNewAmount(e.target.value)} }
              />
            </div>

            <div className="input__wrapper">
              <div className="input input--account">
                <FaBuildingColumns className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input 
                  readOnly
                  className="input__field"
                  placeholder="Account"
                  value={ user!.accounts.find(a => a.id === newAccount)?.name ?? "" }
                  onClick={ () => {setAccountListShown(!accountListShown)} }
                />
              </div>

              {
                accountListShown &&
                <List 
                  className="input__dropdown"
                  elements={ user!.accounts }
                  ListItem={ ModalAccount }
                />
              }
            </div>
          </div>

          {
            !modalTrans?.recurrence_period &&
            <div className="modal--trans__row modal--trans__row--2">
              <div 
                className={`toggle ${isConfirmed ? "toggle--toggled" : "toggle--untoggled--yellow"}`}
                onClick= { () => {setIsConfirmed(!isConfirmed)} }
              >
                <div className={`toggle__checkbox ${isConfirmed ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled--yellow"}`}/>
                <div className="toggle__label"> { isConfirmed ? "Confirmed" : "Pending" }</div>
              </div>

              <div className={`input__wrapper ${isConfirmed ? "" : "input--disabled"}`}>
                <div className="input__label">
                  Confirmation Date
                </div>

                <DatePicker 
                  value={ newConfirmationDate }
                  onChange={ (newDate) => {setNewConfirmationDate(newDate!)} }
                  disabled={ !isConfirmed }
                />
              </div>

              <div 
                className={`input input--time ${isConfirmed ? "": "input--disabled"}`}
                onClick={ isConfirmed ? () => {setConfirmationClockShown(!confirmationClockShown)} : () => {} }
              >
                <FaClock className="input__icon"/>
                <input
                  type="string" 
                  className="input__field"
                  readOnly
                  value={`${String(newConfirmationDate.getHours()).padStart(2, '0')}:${String(newConfirmationDate.getMinutes()).padStart(2, '0')}`}
                  onChange={ e => {setNewAmount(e.target.value)} }
                />
              </div>

              {
                modalTrans!.operation === "POST" &&
                <div className="modal--trans__switches">
                  <div 
                    className={`switch switch--income ${newType === 'income' ? 'switch--selected' : ''}`}
                    onClick={ () => {setNewType('income')} }
                  > <FaPlus/>
                  </div>

                  <div 
                    className={`switch switch--expense ${newType === 'expense' ? 'switch--selected' : ''}`}
                    onClick={ () => {setNewType('expense')} }
                  > <FaMinus/>
                  </div>
                </div>
              }
            </div>
          }

          <div className="modal--trans__row modal--trans__row--3">
            <div className="input__wrapper">
              <div className="input input--category input--category--root">
                <FaTag className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input 
                  readOnly
                  className="input__field"
                  placeholder="Parent Category"
                  value={ displayCategories.find(c => c.id === newCategory?.root)?.name ?? "" }
                  onClick={ () => {toggleCategoryList("root")} }
                />
              </div>

              {
                categoryListShown === 'root' &&
                <div className="input__dropdown input__dropdown--category">
                  <ModalUncategorized type="root"/>

                  <List 
                    elements={ displayCategories.filter(c => !c.parent && !c.grandparent ) }
                    ListItem={ ModalCategory }
                    unwrapped={ true }
                  />
                </div>
              }
            </div>

            <div className="input__wrapper">
              <div className={`input input--category input--category--child ${newCategory?.root ? "" : "input--disabled"}`}>
                <FaTag className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input 
                  readOnly
                  className="input__field"
                  placeholder="Child Category"
                  value={ displayCategories.find(c => c.id === newCategory?.child)?.name ?? "" }
                  onClick={ () => {toggleCategoryList("child")} }
                />
              </div>

              {
                categoryListShown === 'child' && newCategory?.root &&
                <div className="input__dropdown input__dropdown--category">
                  <ModalUncategorized type="child"/>

                  <List 
                    elements={ displayCategories.filter(c => c.parent && !c.grandparent && c.parent === newCategory?.root ) }
                    ListItem={ ModalCategory }
                    unwrapped={ true }
                  />
                </div>
              }
            </div>

            <div className="input__wrapper">
            <div className={`input input--category input--category--grandchild ${newCategory?.child ? "" : "input--disabled"}`}>
                <FaTag className="input__icon"/>
                <FaChevronDown className="input__chevron"/>
                
                <input 
                  readOnly
                  className="input__field"
                  placeholder="Grandchild Category"
                  value={ displayCategories.find(c => c.id === newCategory?.grandchild)?.name ?? "" }
                  onClick={ () => {toggleCategoryList("grandchild")} }
                />
              </div>

              {
                categoryListShown === 'grandchild' && newCategory?.child &&
                <div className="input__dropdown input__dropdown--category">
                  <ModalUncategorized type="grandchild"/>

                  <List 
                    elements={ displayCategories.filter(c => c.parent && c.grandparent && c.parent === newCategory?.child ) }
                    ListItem={ ModalCategory }
                    unwrapped={ true }
                  />
                </div>
              }
            </div>
          </div>

          {
            !modalTrans?.recurrence && !modalTrans?.recurrence_period &&
            <div className="modal--trans__row modal--trans__row--4">
              <div 
                className={`toggle ${isInStallments ? "toggle--toggled" : ""} ${modalTrans?.operation === "PUT" ? "toggle--disabled" : ""}`}
                onClick= { modalTrans?.operation === "PUT" ? () => {} : () => {handleSetRecurrenceType("stallments")} }
              >
                <div className={`toggle__checkbox ${isInStallments ? "toggle__checkbox--toggled" : ""}`}/>
                <div className="toggle__label">In stallments</div>
              </div>

              <div className={`input__wrapper ${modalTrans?.stallments_period ? "input--disabled" : ""}`}>
                <div className={`input input--category input--recurring-period ${isInStallments ? "" : "input--disabled"}`}>
                  <FaCalendarDay className="input__icon"/>
                  <FaChevronDown className="input__chevron"/>

                  <input
                    readOnly
                    className="input__field"
                    placeholder="Frequency"
                    value={ newStallmentsPeriod ? newStallmentsPeriod.charAt(0).toUpperCase() + newStallmentsPeriod.slice(1) : "" }
                    onClick={ isInStallments ? () => {setStallmentsPeriodListShown(!stallmentsPeriodListShown)} : () => {} }
                  />
                </div>

                {
                  isInStallments && stallmentsPeriodListShown && !modalTrans?.stallments_period &&
                  <List 
                    className="input__dropdown"
                    elements={ recurrencePeriods }
                    ListItem={ ModalStallmentsPeriod }
                  />
                }
              </div>

              <div className={`input input--count ${isInStallments ? "" : "input--disabled"}`}>
                <FaCirclePlus className="input__icon"/>
                <input
                  type="number" 
                  className="input__field"
                  placeholder="Count"
                  readOnly
                  value={ newStallmentsCount ?? "" }
                />
                <div className="input__incrementors">                  
                  <div 
                    className="input__incrementor"
                    onClick={ () => {handleSetStallmentsCount("increment")} }
                  > <FaChevronUp/>
                  </div>

                  <div 
                    className={`input__incrementor ${newStallmentsCount === 1 ? "input__incrementor--disabled" : ""}`}
                    onClick={ () => {handleSetStallmentsCount("decrement")} }
                  > <FaChevronDown/>
                  </div>
                </div>
              </div>
            </div>
          }

          {
            !modalTrans?.stallments_period && 
            <div className="modal--trans__row modal--trans__row--5">
              <div 
                className={`toggle ${isRecurring ? "toggle--toggled" : ""} ${modalTrans?.operation === "PUT" ? "toggle--disabled" : ""}`}
                onClick= { modalTrans?.operation === "PUT" ? () => {} : () => {handleSetRecurrenceType("recurring")} }
              >
                <div className={`toggle__checkbox ${isRecurring ? "toggle__checkbox--toggled" : ""}`}/>
                <div className="toggle__label">Recurring</div>
              </div>

              <div className="input__wrapper">
                <div className={`input input--category input--recurring-period ${isRecurring ? "" : "input--disabled"}`}>
                  <FaCalendarDay className="input__icon"/>
                  <FaChevronDown className="input__chevron"/>

                  <input
                    readOnly
                    className="input__field"
                    placeholder="Frequency"
                    value={ newRecurrencePeriod ? newRecurrencePeriod.charAt(0).toUpperCase() + newRecurrencePeriod.slice(1) : "" }
                    onClick={ isRecurring ? () => {setRecurringPeriodListShown(!recurringPeriodListShown)} : () => {} }
                  />
                </div>

                {
                  isRecurring && recurringPeriodListShown &&
                  <List 
                    className="input__dropdown"
                    elements={ recurrencePeriods }
                    ListItem={ ModalRecurringPeriod }
                  />
                }
              </div>
            </div>
          }
        </div>

        <div className="modal--trans__submit">
          {
            (isInStallments|| isRecurring) && modalTrans?.operation === "PUT" &&
            <div className="modal--trans__update-types">
              {
                !modalTrans?.recurrence_period &&
                <div 
                  className={`toggle toggle--small ${updateType === "current" ? "toggle--toggled" : "toggle--untoggled"}`}
                  onClick= { () => {setUpdateType("current")} }
                >
                  <div className={`toggle__checkbox ${updateType === "current" ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled"}`}/>
                  <div className="toggle__label">Update Current</div>
                </div>
              }

              <div 
                className={`toggle toggle--small ${updateType === "future" ? "toggle--toggled" : "toggle--untoggled-"}`}
                onClick= { () => {setUpdateType("future")} }
              >
                <div className={`toggle__checkbox ${updateType === "future" ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled"}`}/>
                <div className="toggle__label">Update Future </div>
              </div>

              <div 
                className={`toggle toggle--small ${updateType === "all" ? "toggle--toggled" : "toggle--untoggled"}`}
                onClick= { () => {setUpdateType("all")} }
              >
                <div className={`toggle__checkbox ${updateType === "all" ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled"}`}/>
                <div className="toggle__label">Update All</div>
              </div>
            </div>
          }

          <div className="modal--trans__btns">
            {
              modalTrans!.operation === "PUT" &&
              <button 
                className="btn btn--bg-red"
                onClick={ handleDeleteFinancialEvent }
              > {`DELETE ${modalTrans?.recurrence_period ? "RECURRING" : ""} ${newType.toUpperCase()}`}
              </button>
            }

            <button 
              className="btn btn--bg-blue"
              onClick={ handleSetFinancialEvent }
            > { modalDesc }
            </button>
          </div>
        </div>

        {
          dueClockShown &&
          <div 
            className="input__bg"
            onClick={ () => {setDueClockShown(false)} }
          >
            <div 
              className="input__clock"
              onClick={ e => {e.stopPropagation()}}
            >
              <StaticTimePicker 
                ampm={ false }
                defaultValue={ newDueDate }
                onAccept={ (newTime) => {handleSetNewTime(newTime!, "due")} }
                onClose={ () => {setDueClockShown(false)} }
              />
            </div>
          </div>
        }
        
        {
          confirmationClockShown &&
          <div 
            className="input__bg"
            onClick={ () => {setConfirmationClockShown(false)} }
          >
            <div 
              className="input__clock"
              onClick={ e => {e.stopPropagation()}}
            >
              <StaticTimePicker 
                ampm={ false }
                defaultValue={ newConfirmationDate }
                onAccept={ (newTime) => {handleSetNewTime(newTime!, "confirmation")} }
                onClose={ () => {setConfirmationClockShown(false)} }
              />
            </div>
          </div>
        }
        </LocalizationProvider>
      </div>
    </div>
  )
}