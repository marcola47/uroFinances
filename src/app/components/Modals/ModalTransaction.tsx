// refactor
// disable recurring if in stallments is selected and vice versa

import { useState, useEffect, useRef } from "react";

import { TUUID, TUserAccount, TUserCategory, TTransactionType, TTransactionCategory, TRecurringPeriod, TRecurringPaidMonths } from "@/types/types";
import { useUserContext } from "@/app/context/User";
import { useUIContext } from "@/app/context/Ui";

import formatCurrency from "@/libs/helpers/formatCurrency";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, StaticTimePicker } from "@mui/x-date-pickers"

import List from "../List/List";
import { FaChevronDown, FaXmark, FaAlignLeft, FaDollarSign, FaClock, FaBuildingColumns, FaTag, FaCalendarDay, FaCirclePlus } from "react-icons/fa6";

export default function ModalTrans(): JSX.Element {
  const { user } = useUserContext();
  const { setModalTransShown, modalTransData, setModalTransData } = useUIContext();
  
  const [clockShown, setClockShown] = useState<boolean>(false);
  const [accountListShown, setAccountListShown] = useState<boolean>(false);
  const [categoryListShown, setCategoryListShown] = useState<string>("");
  const [recurringPeriodListShown, setRecurringPeriodListShown] = useState<boolean>(false);
  const [inStallmentsPeriodListShown, setInStallmentsPeriodListShown] = useState<boolean>(false);
  
  const [modalDesc, setModalDesc] = useState<string>(".");
  const [displayCategories, setDisplayCategories] = useState<TUserCategory[]>([]);

  const [newID, setNewID] = useState<TUUID>(modalTransData!.id ?? null);
  const [newName, setNewName] = useState<string>(modalTransData!.name ?? "");
  const [newAccount, setNewAccount] = useState<TUUID>(modalTransData!.account ?? "");
  const [newType, setNewType] = useState<TTransactionType>(modalTransData!.type ?? "expense");
  const [newAmount, setNewAmount] = useState<string | null>(modalTransData!.amount ? modalTransData!.amount.toString() : null);
  const [newDueDate, setNewDueDate] = useState<Date>(modalTransData!.due_date ? new Date(modalTransData!.due_date) : new Date());
  const [newConfirmed, setNewConfirmed] = useState<boolean>(modalTransData!.confirmed ?? true);
  const [newRecurring, setNewRecurring] = useState<boolean>(modalTransData!.recurring ?? false);
  const [newRecurringPeriod, setNewRecurringPeriod] = useState<TRecurringPeriod | null>(modalTransData!.recurring_period ?? null);
  const [newRecurringMonths, setNewRecurringMonths] = useState<number[] | null>(modalTransData!.recurring_months ?? null);
  const [newInStallments, setNewInStallments] = useState<boolean>(modalTransData!.in_stallments ?? false);
  const [newInStallmentsCount, setNewInStallmentsCount] = useState<number>(modalTransData!.in_stallments_count ?? 0);
  const [newInStallmentsCurrent, setNewInStallmentsCurrent] = useState<number | null>(modalTransData!.in_stallments_current ?? null);
  const [newInStallmentsPeriod, setNewInStallmentsPeriod] = useState<TRecurringPeriod | null>(modalTransData!.in_stallments_period ?? null);
  const [newCategory, setNewCategory] = useState<TTransactionCategory | null>(modalTransData!.category ?? null);

  // must be objects to work with my List component
  const recurringPeriods = [ { name: "monthly" }, { name: "quarterly" }, { name: "semi-annual" }, { name: "annual" } ]

  // reset selected category, reset category list, set new modal description
  useEffect(() => {
    setDisplayCategories(user!.categories.filter(c => c.type === newType));
    
    if (newCategory !== modalTransData!.category)
      setNewCategory(null);

    console.log(newCategory);

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
      installments_count: newInStallmentsCount,
      in_stallments_current: newInStallmentsCurrent,
      category: newCategory
    }

    console.log(newTransaction);
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
  
  function ModalRecurringPeriod({ itemData: recurringPeriod }: { itemData: { name: TRecurringPeriod } }) {
    function handleSetNewRecurringPeriod() {
      setNewRecurringPeriod(recurringPeriod?.name);
      setRecurringPeriodListShown(false);
    }
    
    return (
      <div 
        className={`recurring-period ${newRecurringPeriod === recurringPeriod?.name ? "recurring-period--selected" : ""}`}
        onClick={ handleSetNewRecurringPeriod }
      > 
        <div className="recurring=period__name">
          { recurringPeriod.name ? recurringPeriod.name?.charAt(0).toUpperCase() + recurringPeriod.name?.slice(1) : "" }
        </div>
      </div>
    )
  }

  function ModalInStallmentsPeriod({ itemData: inStallmentsPeriod }: { itemData: { name: TRecurringPeriod } }) {
    function handleSetNewInStallmentsPeriod() {
      setNewInStallmentsPeriod(inStallmentsPeriod?.name);
      setInStallmentsPeriodListShown(false);
    }
    
    return (
      <div 
        className={`recurring-period ${newInStallmentsPeriod === inStallmentsPeriod?.name ? "recurring-period--selected" : ""}`}
        onClick={ handleSetNewInStallmentsPeriod }
      > 
        <div className="recurring=period__name"> 
          { inStallmentsPeriod.name ? inStallmentsPeriod.name?.charAt(0).toUpperCase() + inStallmentsPeriod.name?.slice(1) : "" }
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
              className={`toggle ${newInStallments ? "toggle--toggled" : ""}`}
              onClick= { () => {setNewInStallments(!newInStallments)} }
            >
              <div className={`toggle__checkbox ${newInStallments ? "toggle__checkbox--toggled" : ""}`}/>
              <div className="toggle__label">In stallments</div>
            </div>

            <div className="input__wrapper">
              <div className={`input input--category input--recurring-period ${newInStallments ? "" : "input--disabled"}`}>
                <FaCalendarDay className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input
                  readOnly
                  className="input__field"
                  placeholder="Frequency"
                  value={ newInStallmentsPeriod ? newInStallmentsPeriod.charAt(0).toUpperCase() + newInStallmentsPeriod.slice(1) : "" }
                  onClick={ newInStallments ? () => {setInStallmentsPeriodListShown(!inStallmentsPeriodListShown)} : () => {} }
                />
              </div>

              {
                newInStallments && inStallmentsPeriodListShown &&
                <List 
                  className="input__dropdown"
                  elements={ recurringPeriods }
                  ListItem={ ModalInStallmentsPeriod }
                />
              }
            </div>

            
            <div className={`input input--count ${newInStallments ? "" : "input--disabled"}`}>
              <FaCirclePlus className="input__icon"/>
              <input
                type="number" 
                className="input__field"
                placeholder="Count"
                onChange={ e => {setNewInStallmentsCount(Number(e.target.value))} }
              />
            </div>
          </div>

          <div className="modal--trans__row modal--trans__row--5">
            <div 
              className={`toggle ${newRecurring ? "toggle--toggled" : ""}`}
              onClick= { () => {setNewRecurring(!newRecurring)} }
            >
              <div className={`toggle__checkbox ${newRecurring ? "toggle__checkbox--toggled" : ""}`}/>
              <div className="toggle__label">Recurring</div>
            </div>

            <div className="input__wrapper">
              <div className={`input input--category input--recurring-period ${newRecurring ? "" : "input--disabled"}`}>
                <FaCalendarDay className="input__icon"/>
                <FaChevronDown className="input__chevron"/>

                <input
                  readOnly
                  className="input__field"
                  placeholder="Frequency"
                  value={ newRecurringPeriod ? newRecurringPeriod.charAt(0).toUpperCase() + newRecurringPeriod.slice(1) : "" }
                  onClick={ newRecurring ? () => {setRecurringPeriodListShown(!recurringPeriodListShown)} : () => {} }
                />
              </div>

              {
                newRecurring && recurringPeriodListShown &&
                <List 
                  className="input__dropdown"
                  elements={ recurringPeriods }
                  ListItem={ ModalRecurringPeriod }
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}