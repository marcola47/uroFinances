// sorry, this is a big one
// fix dropdown list to be below the input

import { useState, useEffect } from "react";

import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";
import { useTransactionsContext } from "@/app/context/Transactions";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import List from "../List/List";
import { 
  FaChevronDown, 
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
import { is } from "date-fns/locale";

export default function ModalTrans(): JSX.Element {
  const { user } = useUserContext();
  const { transactions, setTransactions, setRecurrences } = useTransactionsContext();
  const { setModalTransShown, modalTransData, setModalTransData } = useUIContext();
  
  const [dueClockShown, setDueClockShown] = useState<boolean>(false);
  const [confirmationClockShown, setConfirmationClockShown] = useState<boolean>(false);
  const [accountListShown, setAccountListShown] = useState<boolean>(false);
  const [categoryListShown, setCategoryListShown] = useState<string>("");
  const [recurringPeriodListShown, setRecurringPeriodListShown] = useState<boolean>(false);
  const [stallmentsPeriodListShown, setStallmentsPeriodListShown] = useState<boolean>(false);
  
  const [modalDesc, setModalDesc] = useState<string>(".");
  const [displayCategories, setDisplayCategories] = useState<TUserCategory[]>([]);
  
  const [newID, setNewID] = useState<TUUID>(modalTransData!.id ?? undefined);
  const [newName, setNewName] = useState<string>(modalTransData!.name ?? "");
  const [newAccount, setNewAccount] = useState<TUUID>(modalTransData!.account ?? "");
  const [newType, setNewType] = useState<TFinancialEventType>(modalTransData!.type ?? "expense");
  const [newAmount, setNewAmount] = useState<string>(modalTransData!.amount ? (modalTransData!.amount).toFixed(2).toString() : "0");
  const [newRegDate, setNewRegDate] = useState<Date>(new Date(modalTransData?.reg_date ?? new Date()));
  const [newDueDate, setNewDueDate] = useState<Date>(new Date(modalTransData?.due_date ?? new Date()));
  const [newConfirmationDate, setNewConfirmationDate] = useState<Date>(new Date(modalTransData?.confirmation_date ?? new Date()));
  const [newCategory, setNewCategory] = useState<TFinancialEventCategory>(modalTransData!.category ?? { root: null, child: null, grandchild: null  });
  const [newConfirmed, setNewConfirmed] = useState<boolean>(modalTransData!.confirmation_date ? true : false);
  const [newRecurrence, setNewRecurrence] = useState<TUUID>(modalTransData!.recurrence ?? undefined);
  const [newRecurrencePeriod, setNewRecurrencePeriod] = useState<TFinancialEventPeriod | undefined>(modalTransData!.recurrence_period ?? undefined);
  const [newStallments, setNewStallments] = useState<TUUID>(modalTransData!.stallments ?? undefined);
  const [newStallmentsCount, setNewStallmentsCount] = useState<number | undefined>(modalTransData!.stallments_count ?? undefined);
  const [newStallmentsCurrent, setNewStallmentsCurrent] = useState<number | undefined>(modalTransData!.stallments_current ?? undefined);
  const [newStallmentsPeriod, setNewStallmentsPeriod] = useState<TFinancialEventPeriod | undefined>(modalTransData!.stallments_period ?? undefined);

  const [isRecurring, setIsRecurring] = useState<boolean>(modalTransData!.recurrence || modalTransData?.recurrence_period ? true : false);
  const [isInStallments, setIsInStallments] = useState<boolean>(modalTransData!.stallments ? true : false);
  const [updateType, setUpdateType] = useState<"current" | "future" | "all">("current");

  // must be objects to work with my List component
  const recurrencePeriods = [ 
    { name: "monthly" }, 
    { name: "quarterly" }, 
    { name: "semi-annual" }, 
    { name: "annual" } 
  ]

  // reset selected category, reset category list, set new modal description
  useEffect(() => {
    console.log(modalTransData)
    setDisplayCategories(user!.categories.filter(c => c.type === newType));
    
    if (newCategory !== modalTransData!.category)
      setNewCategory({ root: null, child: null, grandchild: null  });

    if (modalTransData!.operation === "POST") {
      switch (newType) {
        case "income": setModalDesc("ADD INCOME"); break;
        case "expense": setModalDesc("ADD EXPENSE"); break;
      }
    }

    else {
      switch (newType) {
        case "income": setModalDesc(`EDIT ${modalTransData?.recurrence_period ? "RECURRING" : ""} INCOME`); break;
        case "expense": setModalDesc(`EDIT ${modalTransData?.recurrence_period ? "RECURRING" : ""} EXPENSE`); break;
      }
    }
  }, [newType])

  // adjust confirmed status when user changes due date
  useEffect(() => {
    if (new Date(newDueDate) > new Date() && !modalTransData!.confirmation_date)
      setNewConfirmed(false);

    else
      setNewConfirmed(true);
  }, [newDueDate])

  
  function handleHideModal() {
    setModalTransShown(false);
    setModalTransData(null);
  }
  
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
  
  function toggleCategoryList(list: string) {
    if (categoryListShown === list)
      setCategoryListShown("");

    else
      setCategoryListShown(list);
  }

  async function handleSetFinancialEvent() {
    if (!newAmount || newAmount === "0" || newAmount === "0,00") 
      return alert("Amount is required");

    if (!newAccount)
      return alert("Account is required");

    if (!newName) 
      return alert("Name is required");


    let resTransactions: TTransaction[] = [];
    let resRecurrence: TRecurrence | null = null;

    const newFinancialEvent = {
      id: newID,
      name: newName,
      user: user!.id,
      account: newAccount,
      type: newType,
      category: newCategory,
      amount: parseFloat(newAmount.replace(/[\D]+/g,'')) / 100,
      reg_date: newRegDate,
      due_date: newDueDate,
    }
    
    if (isRecurring && newRecurrencePeriod) {
      (newFinancialEvent as TRecurrence).recurrence_period = newRecurrencePeriod;

      const res = await fetch('/api/recurrences', {
        headers: { type: "application/json" },
        method: modalTransData!.operation,
        body: JSON.stringify({ 
          recurrence: newFinancialEvent,
          confirmationDate: newConfirmed ? newConfirmationDate : undefined
        })
      })

      const { status, err, data } = await res.json();

      if (status >= 400 && status < 200) {
        console.log(err);
        return;
      }
      
      resRecurrence = data.recurrence;
      data.transaction && resTransactions.push(data.transaction);
    }

    else {
      (newFinancialEvent as TTransaction).confirmation_date = newConfirmed ? new Date() : undefined;
      (newFinancialEvent as TTransaction).recurrence = newRecurrence;
      (newFinancialEvent as TTransaction).stallments = newStallments;

      if (isInStallments) {
        (newFinancialEvent as TTransaction).stallments_count = newStallmentsCount;
        (newFinancialEvent as TTransaction).stallments_current = newStallmentsCurrent;
        (newFinancialEvent as TTransaction).stallments_period = newStallmentsPeriod;
      }

      const res = await fetch('/api/transactions', {
        headers: { type: "application/json" },
        method: modalTransData!.operation,
        body: JSON.stringify({ transaction: newFinancialEvent })
      })

      const { status, err, data } = await res.json();

      if (status >= 400 && status < 200) {
        console.log(err);
        return;
      }

      resTransactions = [...resTransactions, ...data];
    }

    if (modalTransData!.operation === "POST") {
      if (resRecurrence) // as TRecurrence needed because ts would complain that you cannot insert TRecurrence | null into TRecurrence[]
        setRecurrences(prevRecurrences => [...prevRecurrences, resRecurrence as TRecurrence]);

      if (resTransactions.length > 0)
        setTransactions(prevTransactions => [...prevTransactions, ...resTransactions]);
    }

    else if (modalTransData!.operation === "PUT") {
      if (resTransactions.length > 0) {
        const transactionsCopy = transactions.map(transaction => {
          const matchingResTransaction = resTransactions.find(resTransaction => resTransaction.id === transaction.id);
          return matchingResTransaction ? { ...transaction, ...matchingResTransaction } : transaction;
        });
      
        setTransactions(transactionsCopy);
      }

      // recurrence: 
      // update future recurrences:
      // -- update current transaction and recurrence data
      // update current recurrence:
      // -- update current transaction only

      // stallments:
      // increase count:
      // -- change the name of all stallments with the new count and create new transactions for the new stallments
      // decrease count:
      // -- change the name of all stallments with the new count and delete all stallments with the count greater than the new count

      // single transaction:
      // make it recurring:
      // -- create new recurrence with the transaction data and update the transaction with the recurrence id
      // make it stallments:
      // -- create new stallments with the transaction data and update the transaction with the stallments id
    }

    handleHideModal();
  }

  async function handleDeleteTransaction() {
    let resTransactions: TTransaction[] = [];
    let resRecurrence: TRecurrence | null = null;
    
    const newFinancialEvent = {
      id: newID,
      name: newName,
      user: user!.id,
      account: newAccount,
      type: newType,
      category: newCategory,
      amount: parseFloat(newAmount.replace(/[\D]+/g,'')) / 100,
      reg_date: newRegDate,
      due_date: newDueDate,
    }
    

    if (isRecurring) {

    }

    else if (isInStallments) {

    }

    else {
      (newFinancialEvent as TTransaction).confirmation_date = newConfirmed ? new Date() : undefined;
      (newFinancialEvent as TTransaction).recurrence = newRecurrence;
      (newFinancialEvent as TTransaction).stallments = newStallments;

      const res = await fetch('/api/transactions', {
        headers: { type: "application/json" },
        method: "DELETE",
        body: JSON.stringify({ transaction: newFinancialEvent })
      })

      const { status, error, data } = await res.json();

      if (status >= 400 && status < 200) {
        console.log(error);
        return;
      }

      resTransactions = [...resTransactions, ...data];
    }

    if (resTransactions.length > 0) {
      const transactionsCopy = transactions.filter(transaction => !resTransactions.some(resTransaction => resTransaction.id === transaction.id));
      setTransactions(transactionsCopy);
    }

    handleHideModal();

    // recurrences:
    // delete current only:
    // -- delete current transaction, just as with unconfirming
    // delete this and future:
    // -- delete current transaction and recurrence data

    // stallments:
    // delete current only:
    // -- delete current transaction
    // delete this and future:
    // -- delete current transaction and others with the count greater than the current
    // delete all:
    // -- delete all transactions with the given stallment id


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
      className="modal-bg"
      onClick={ handleHideModal }
    >
      <div 
        className="modal--trans"
        onClick={ e => e.stopPropagation() }
      >
        <LocalizationProvider dateAdapter={ AdapterDateFns }>
        <div className="modal--trans__header">
          <FaXmark 
            className="modal--trans__close" 
            onClick={ handleHideModal }
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
                Due Date
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
            !modalTransData?.recurrence_period &&
            <div className="modal--trans__row modal--trans__row--2">
              <div 
                className={`toggle ${newConfirmed ? "toggle--toggled" : "toggle--untoggled--yellow"}`}
                onClick= { () => {setNewConfirmed(!newConfirmed)} }
              >
                <div className={`toggle__checkbox ${newConfirmed ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled--yellow"}`}/>
                <div className="toggle__label"> { newConfirmed ? "Confirmed" : "Pending" }</div>
              </div>

              <div className={`input__wrapper ${newConfirmed ? "" : "input--disabled"}`}>
                <div className="input__label">
                  Confirmation Date
                </div>

                <DatePicker 
                  value={ newConfirmationDate }
                  onChange={ (newDate) => {setNewConfirmationDate(newDate!)} }
                  disabled={ !newConfirmed }
                />
              </div>

              <div 
                className={`input input--time ${newConfirmed ? "": "input--disabled"}`}
                onClick={ newConfirmed ? () => {setConfirmationClockShown(!confirmationClockShown)} : () => {} }
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
                modalTransData!.operation === "POST" &&
                <div className="modal--trans__switches">
                  <div 
                    className={`switch switch--income ${newType === 'income' ? 'switch--selected' : ''}`}
                    onClick={ () => {setNewType('income')} }
                    children={ <FaPlus/> }
                  />

                  <div 
                    className={`switch switch--expense ${newType === 'expense' ? 'switch--selected' : ''}`}
                    onClick={ () => {setNewType('expense')} }
                    children={ <FaMinus/> }
                  />
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
            !modalTransData?.recurrence && !modalTransData?.recurrence_period &&
            <div className="modal--trans__row modal--trans__row--4">
              <div 
                className={`toggle ${isInStallments ? "toggle--toggled" : ""} ${modalTransData?.stallments_period ? "toggle--disabled" : ""}`}
                onClick= { modalTransData?.stallments_period ? () => {} : () => {handleSetRecurrenceType("stallments")} }
              >
                <div className={`toggle__checkbox ${isInStallments ? "toggle__checkbox--toggled" : ""}`}/>
                <div className="toggle__label">In stallments</div>
              </div>

              <div className={`input__wrapper ${modalTransData?.stallments_period ? "input--disabled" : ""}`}>
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
                  isInStallments && stallmentsPeriodListShown && !modalTransData?.stallments_period &&
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
                  value={ newStallmentsCount ?? "" }
                  onChange={ e => {setNewStallmentsCount(Number(e.target.value))} }
                />
              </div>
            </div>
          }

          {
            !modalTransData?.stallments_period && !modalTransData?.recurrence && !modalTransData?.recurrence_period && 
            <div className="modal--trans__row modal--trans__row--5">
              <div 
                className={`toggle ${isRecurring ? "toggle--toggled" : ""}`}
                onClick= { () => {handleSetRecurrenceType("recurring")} }
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
            (modalTransData?.stallments_period || modalTransData?.recurrence_period) && modalTransData?.operation === "PUT" &&
            <div className="modal--trans__update-types">
              <div 
                className={`toggle toggle--small ${updateType === "current" ? "toggle--toggled" : "toggle--untoggled"}`}
                onClick= { () => {setUpdateType("current")} }
              >
                <div className={`toggle__checkbox ${updateType === "current" ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled"}`}/>
                <div className="toggle__label">Update Current</div>
              </div>

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
              modalTransData!.operation === "PUT" &&
              <button 
                className="btn btn--bg-red"
                onClick={ handleDeleteTransaction }
                children={`DELETE ${modalTransData?.recurrence_period ? "RECURRING" : ""} ${newType.toUpperCase()}`}
              />
            }

            <button 
              className="btn btn--bg-blue"
              onClick={ handleSetFinancialEvent }
              children={ modalDesc }
            />
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