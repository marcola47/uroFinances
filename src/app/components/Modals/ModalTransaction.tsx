// sorry, this is a big one
// fix dropdown list to be below the input

import { useState, useEffect } from "react";

import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";
import { useTransactionsContext } from "@/app/context/Transactions";
import { TUUID, TUserAccount, TUserCategory, TTransaction, TRecurrence, TFinancialEventType, TFinancialEventCategory, TFinancialEventPeriod } from "@/types/types";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import List from "../List/List";
import { FaChevronDown, FaXmark, FaAlignLeft, FaDollarSign, FaClock, FaBuildingColumns, FaTag, FaCalendarDay, FaCirclePlus } from "react-icons/fa6";

export default function ModalTrans(): JSX.Element {
  const { user } = useUserContext();
  const { transactions, setTransactions, recurrences, setRecurrences } = useTransactionsContext();
  const { setModalTransShown, modalTransData, setModalTransData } = useUIContext();
  
  const [clockShown, setClockShown] = useState<boolean>(false);
  const [accountListShown, setAccountListShown] = useState<boolean>(false);
  const [categoryListShown, setCategoryListShown] = useState<string>("");
  const [recurringPeriodListShown, setRecurringPeriodListShown] = useState<boolean>(false);
  const [stallmentsPeriodListShown, setStallmentsPeriodListShown] = useState<boolean>(false);
  
  const [modalDesc, setModalDesc] = useState<string>(".");
  const [displayCategories, setDisplayCategories] = useState<TUserCategory[]>([]);
  
  const [newID, setNewID] = useState<TUUID>(modalTransData!.id ?? "");
  const [newName, setNewName] = useState<string>(modalTransData!.name ?? "");
  const [newAccount, setNewAccount] = useState<TUUID>(modalTransData!.account ?? "");
  const [newType, setNewType] = useState<TFinancialEventType>(modalTransData!.type ?? "expense");
  const [newAmount, setNewAmount] = useState<string>(modalTransData!.amount ? (modalTransData!.amount).toFixed(2).toString() : "0");
  const [newRegDate, setNewRegDate] = useState<Date>(new Date(modalTransData?.reg_date ?? new Date()));
  const [newDueDate, setNewDueDate] = useState<Date>(new Date(modalTransData?.due_date ?? new Date()));
  const [newCategory, setNewCategory] = useState<TFinancialEventCategory>(modalTransData!.category ?? { root: null, child: null, grandchild: null  });
  const [newConfirmed, setNewConfirmed] = useState<boolean>(modalTransData!.confirmation_date ? true : false);
  const [newRecurrence, setNewRecurrence] = useState<TUUID>(modalTransData!.recurrence ?? undefined);
  const [newRecurrencePeriod, setNewRecurrencePeriod] = useState<TFinancialEventPeriod | undefined>(modalTransData!.recurrence_period ?? undefined);
  const [newStallments, setNewStallments] = useState<TUUID>(modalTransData!.stallments ?? undefined);
  const [newStallmentsCount, setNewStallmentsCount] = useState<number | undefined>(modalTransData!.stallments_count ?? undefined);
  const [newStallmentsCurrent, setNewStallmentsCurrent] = useState<number | undefined>(modalTransData!.stallments_current ?? undefined);
  const [newStallmentsPeriod, setNewStallmentsPeriod] = useState<TFinancialEventPeriod | undefined>(modalTransData!.stallments_period ?? undefined);

  const [isRecurring, setIsRecurring] = useState<boolean>(modalTransData!.recurrence ? true : false);
  const [isInStallments, setIsInStallments] = useState<boolean>(modalTransData!.stallments ? true : false);

  // must be objects to work with my List component
  const recurrencePeriods = [ 
    { name: "monthly" }, 
    { name: "quarterly" }, 
    { name: "semi-annual" }, 
    { name: "annual" } 
  ]

  // reset selected category, reset category list, set new modal description
  useEffect(() => {
    console.log(modalTransData);
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
        case "income": setModalDesc("EDIT INCOME"); break;
        case "expense": setModalDesc("EDIT EXPENSE"); break;
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

  
  function handleHideModalTrans() {
    setModalTransShown(false);
    setModalTransData(null);
  }
  
  function handleSetNewTime(newTime: Date) {
    setNewDueDate(newTime);
    setClockShown(false);
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
    if (!newName) 
      return alert("Name is required");

    if (!newAmount) 
      return alert("Amount is required");

    if (!newAccount)
      return alert("Account is required");

    let resTransactions: TTransaction[] = [];
    let resRecurrence: TRecurrence | null = null;

    const newFinancialEvent = {
      id: newID !== "" ? newID : undefined,
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
      (newFinancialEvent as any).confirmation_date = newConfirmed ? new Date() : undefined;
      (newFinancialEvent as any).recurrence_period = newRecurrencePeriod;

      const res = await fetch('/api/recurrences', {
        headers: { type: "application/json" },
        method: modalTransData!.operation,
        body: JSON.stringify({ recurrence: newFinancialEvent })
      })

      const { status, err, data } = await res.json();

      if (status >= 400 && status < 200) {
        console.log(err);
        return;
      }

      if (data.transaction)
        resTransactions = [...resTransactions, data.transaction];
      
      resRecurrence = data.recurrence;
    }

    else {
      if (isInStallments) {
        (newFinancialEvent as any).confirmation_date = newConfirmed ? new Date() : undefined;
        (newFinancialEvent as any).stallments = newStallments;
        (newFinancialEvent as any).stallments_count = newStallmentsCount;
        (newFinancialEvent as any).stallments_current = newStallmentsCurrent;
        (newFinancialEvent as any).stallments_period = newStallmentsPeriod;
      }

      else {
        (newFinancialEvent as any).confirmation_date = newConfirmed ? new Date() : undefined;
        (newFinancialEvent as any).recurrence = newRecurrence;
        (newFinancialEvent as any).stallments = newStallments;
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
      // recurrence: 
      // update future recurrences:
      // -- update current transaction and recurrence data
      // update current recurrence:
      // -- update current transaction only

      // stallments:
      // -- map through transactions and update the one with the given ids

      // single transaction:
      // -- map through transactions and update the one with the given id
    }

    handleHideModalTrans();
  }

  async function handleDeleteTransaction() {
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
      onClick={ handleHideModalTrans }
    >
      <div 
        className="modal--trans"
        onClick={ e => e.stopPropagation() }
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
                  onChange={ e => {setNewAmount(e.target.value)} }
                />

                {
                  clockShown &&
                  <div 
                    className="input__clock"
                    onClick={ e => {e.stopPropagation()}}
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

          <div className="modal--trans__row modal--trans__row--2">
            {
              modalTransData!.operation === "POST" &&
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
              className={`toggle ${newConfirmed ? "toggle--toggled" : "toggle--untoggled--yellow"}`}
              onClick= { () => {setNewConfirmed(!newConfirmed)} }
            >
              <div className={`toggle__checkbox ${newConfirmed ? "toggle__checkbox--toggled" : "toggle__checkbox--untoggled--yellow"}`}/>
              
              <div className="toggle__label">
                { newConfirmed ? "Confirmed" : "Pending" }
              </div>
            </div>
          </div>

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

          <div className="modal--trans__row modal--trans__row--4">
            <div 
              className={`toggle ${isInStallments ? "toggle--toggled" : ""}`}
              onClick= { () => {handleSetRecurrenceType("stallments")} }
            >
              <div className={`toggle__checkbox ${isInStallments ? "toggle__checkbox--toggled" : ""}`}/>
              <div className="toggle__label">In stallments</div>
            </div>

            <div className="input__wrapper">
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
                isInStallments && stallmentsPeriodListShown &&
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
                onChange={ e => {setNewStallmentsCount(Number(e.target.value))} }
              />
            </div>
          </div>

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
        </div>

        <div className="modal--trans__btns">
          {
            modalTransData!.operation === "PUT" &&
            <button 
              className="btn btn--bg-red"
              onClick={ handleDeleteTransaction }
              children={`DELETE ${newType.toUpperCase()}`}
            />
          }

          <button 
            className="btn btn--bg-blue"
            onClick={ handleSetFinancialEvent }
            children={ modalDesc }
          />
        </div>
      </div>
    </div>
  )
}