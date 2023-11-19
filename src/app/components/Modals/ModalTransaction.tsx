// refactor
// disable recurring if in stallments is selected and vice versa
// fix dropdown list to be below the input

import { useState, useEffect } from "react";

import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";
import { useTransactionsContext } from "@/app/context/Transactions";
import { TUUID, TUserAccount, TUserCategory, TFinancialEventType, TFinancialEventCategory, TFinancialEventPeriod } from "@/types/types";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import List from "../List/List";
import { FaChevronDown, FaXmark, FaAlignLeft, FaDollarSign, FaClock, FaBuildingColumns, FaTag, FaCalendarDay, FaCirclePlus } from "react-icons/fa6";

export default function ModalTrans(): JSX.Element {
  const { user } = useUserContext();
  const { transactions, setTransactions } = useTransactionsContext();
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
  const [newConfirmed, setNewConfirmed] = useState<boolean>(modalTransData!.confirmed ?? true);
  const [newRecurrence, setNewRecurrence] = useState<TUUID>(modalTransData!.recurrence ?? undefined);
  const [newRecurrencePeriod, setNewRecurrencePeriod] = useState<TFinancialEventPeriod>(modalTransData!.recurrence_period ?? undefined);
  const [newStallments, setNewStallments] = useState<TUUID>(modalTransData!.stallments ?? undefined);
  const [newStallmentsCount, setNewStallmentsCount] = useState<number | undefined>(modalTransData!.stallments_count ?? undefined);
  const [newStallmentsCurrent, setNewStallmentsCurrent] = useState<number | undefined>(modalTransData!.stallments_current ?? undefined);
  const [newStallmentsPeriod, setNewStallmentsPeriod] = useState<TFinancialEventPeriod>(modalTransData!.stallments_period ?? undefined);

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

    if (modalTransData!.operation.includes("create")) {
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

  function toggleCategoryList(list: string) {
    if (categoryListShown === list)
      setCategoryListShown("");

    else
      setCategoryListShown(list);
  }

  function handleHideModalTrans() {
    setModalTransShown(false);
    setModalTransData(null);
  }

  function handleSetNewTime(newTime: Date) {
    setNewDueDate(newTime);
    setClockShown(false);
  }

  async function handleSetFinancialEvent() {
    if (!newName) 
      return alert("Name is required");

    if (!newAmount) 
      return alert("Amount is required");

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
      const newRecurrence = { 
        ...newFinancialEvent, 
        recurrence_period: newRecurrencePeriod 
      };

      console.log(newRecurrence)
    }

    else if (isInStallments) {
      const newStallment = { 
        ...newFinancialEvent, 
        stallments: newStallments,
        stallments_count: newStallmentsCount, 
        stallments_period: newStallmentsPeriod 
      };

      console.log(newStallment)
    }

    else {
      const newTransaction = {
        ...newFinancialEvent,
        confirmed: newConfirmed,
        recurrence: newRecurrence,
        stallments: newStallments
      };

      console.log(newTransaction)
    }

    // const res = await fetch('/api/transactions', {
    //   headers: { type: "application/json" },
    //   method: 'POST',
    //   body: JSON.stringify({
    //     transaction: newTransaction,
    //     operation: modalTransData!.operation
    //   })
    // })

    // const { status, err, data } = await res.json();

    // if (status >= 400 && status < 200) {
    //   console.log(err);
    //   return;
    // }

    // const transactionsCopy = structuredClone(transactions);
    // let existingTransaction = false;

    // transactionsCopy.map(t => {
    //   if (t.id === data.id) {
    //     existingTransaction = true;
    //     return data;
    //   }

    //   else
    //     return t;
    // })

    // if (!existingTransaction)
    //   transactionsCopy.push(data);

    // console.log(data)
    // setTransactions(transactionsCopy);

    // send to api, then:
    // if it's new, set the new id and set the transactions state
    // if existing, find the transaction in the transactions state and update it

    // stallments exceptions:
    // in stallments -> not in stallments => ask the user if they want to:
    //   -> delete all stallments and keep only the first transaction 
    //   -> delete all future stallments and keep previous ones

    // recurring exceptions:
    // recurring -> not recurring => ask the user if they want to:
    //   -> delete all recurrences and keep only the first transaction 
    //   -> delete all future recurrences and keep previous ones
  }

  async function handleDeleteTransaction() {
    const res = await fetch('/api/transactions', {
      headers: { type: "application/json" },
      method: 'DELETE',
      body: JSON.stringify({
        transactionID: modalTransData!.id,
        user: user!.id
      })
    })

    const { status, err } = await res.json();

    if (status >= 400 && status < 200) {
      console.log(err);
      return;
    }

    setTransactions(prevTransactions => prevTransactions.filter(t => t.id !== modalTransData!.id));
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
              modalTransData!.operation.includes("create") &&
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
              className={`toggle ${newStallments ? "toggle--toggled" : ""}`}
              onClick= { () => {setIsInStallments(!isInStallments)} }
            >
              <div className={`toggle__checkbox ${newStallments ? "toggle__checkbox--toggled" : ""}`}/>
              <div className="toggle__label">In stallments</div>
            </div>

            <div className="input__wrapper">
              <div className={`input input--category input--recurring-period ${newStallments ? "" : "input--disabled"}`}>
                <FaCalendarDay className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input
                  readOnly
                  className="input__field"
                  placeholder="Frequency"
                  value={ newStallmentsPeriod ? newStallmentsPeriod.charAt(0).toUpperCase() + newStallmentsPeriod.slice(1) : "" }
                  onClick={ newStallments ? () => {setStallmentsPeriodListShown(!stallmentsPeriodListShown)} : () => {} }
                />
              </div>

              {
                newStallments && stallmentsPeriodListShown &&
                <List 
                  className="input__dropdown"
                  elements={ recurrencePeriods }
                  ListItem={ ModalStallmentsPeriod }
                />
              }
            </div>

            
            <div className={`input input--count ${newStallments ? "" : "input--disabled"}`}>
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
              className={`toggle ${newRecurrence ? "toggle--toggled" : ""}`}
              onClick= { () => {setIsRecurring(!isRecurring)} }
            >
              <div className={`toggle__checkbox ${newRecurrence ? "toggle__checkbox--toggled" : ""}`}/>
              <div className="toggle__label">Recurring</div>
            </div>

            <div className="input__wrapper">
              <div className={`input input--category input--recurring-period ${newRecurrence ? "" : "input--disabled"}`}>
                <FaCalendarDay className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input
                  readOnly
                  className="input__field"
                  placeholder="Frequency"
                  value={ newRecurrencePeriod ? newRecurrencePeriod.charAt(0).toUpperCase() + newRecurrencePeriod.slice(1) : "" }
                  onClick={ newRecurrence ? () => {setRecurringPeriodListShown(!recurringPeriodListShown)} : () => {} }
                />
              </div>

              {
                newRecurrence && recurringPeriodListShown &&
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
            modalTransData!.operation.includes("existing") &&
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