export type TypeAccount = {
  id: string,
  name: string,
  type: "checking" | "savings" | "wallet" | null,
  icon: string
}

export type TypeCategory = {
  id: string,
  name: string,
  icon: string,
  color: string,
  type: "income" | "expense" | null,
  parent: string | null,
  grandparent: string | null
};

export type TypeUser = {
  id: string,
  name: string,
  email: string,
  emailVerified: boolean,
  provider: string,
  providerID: string | number,
  image: string,
  accounts: Accounts[],
  categories: UserCategory[],
  settings: {
    open_navbar_on_hover: boolean,
    show_scrollbars: boolean
  }
};

export type TypeTransaction = {
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