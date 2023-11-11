// Type for handling user data and params/settings
export type TUser = {
  id: string,
  name: string,
  email: string,
  emailVerified: boolean,
  provider: string,
  providerID: string | number,
  image: string,
  accounts: Accounts[],
  categories: TUserCategory[],
  settings: {
    open_navbar_on_hover: boolean,
    hide_scrollbars: boolean
  }
};

// Type for abstracting the user's accounts
export type TypeAccount = {
  id: string,
  name: string,
  type: "checking" | "savings" | "wallet" | null,
  icon: string
}

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

// Type used for everything that needs to handle transactions
export type TTransaction = {
  id: string,
  name: string,
  user: string,
  account: string,
  type: string,
  amount: number,
  registration_date: Date,
  due_date: Date,
  confirmed: boolean,
  recurring: boolean,
  recurring_period: "monthly" | "quarterly" | "semi-annual" | "annual" | null,
  recurring_months: number[] | null,
  recurring_months_paid: [{
    due_month: Date,
    paid_month: Date
  }],
  in_stallments: boolean,
  in_stallments_count: number | null,
  in_stallments_current: number | null,
  category: {
    root: string | null,
    child: string | null,
    grandchild: string | null
  }
}; 