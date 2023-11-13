// Type for defining a uuid reference
export type TUUID = string | null | undefined;

// Type for abstracting the user's accounts
export type TUserAccount = {
  id: string,
  name: string,
  type: "checking" | "savings" | "wallet" | null,
  icon: string
};

// Type for abstracting the user's categories
export type TUserCategory = {
  id: string,
  name: string,
  icon: string,
  color: string,
  type: "income" | "expense" | null,
  parent: string | null,
  grandparent: string | null
};

// Type for handling user data and params/settings
export type TUser = {
  id: string,
  name: string,
  email: string,
  emailVerified: boolean,
  provider: string,
  providerID: string | number,
  image: string,
  accounts: TUserAccount[],
  categories: TUserCategory[],
  settings: {
    open_navbar_on_hover: boolean,
    hide_scrollbars: boolean
  }
};

// Type for defining transaction types
export type TTransactionType = "income" | "expense";

// Type for defining a transaction's recurring period
type TRecurringPeriod = "monthly" | "quarterly" | "semi-annual" | "annual" | null;

// Type for defining a transaction's recurring paid months
type TRecurringPaidMonths = {
  due_month: Date,
  paid_month: Date
};

// Type for defining a transaction's category
export type TTransactionCategory = {
  root: string | null,
  child: string | null,
  grandchild: string | null
};

// Type for everything that needs to handle transactions
export type TTransaction = {
  id: string,
  name: string,
  user: TUUID,
  account: TUUID,
  type: TTransactionType,
  amount: number,
  registration_date: Date,
  due_date: Date,
  confirmed: boolean,
  recurring: boolean,
  recurring_period: TRecurringPeriod,
  recurring_months: number[] | null,
  recurring_months_paid: TRecurringPaidMonths[] | null,
  in_stallments: boolean,
  in_stallments_count: number | null,
  in_stallments_current: number | null,
  category: TTransactionCategory
}; 