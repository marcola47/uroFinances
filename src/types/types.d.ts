/***********************************************************/
//----- Utility Types -----\\

// Type for defining a uuid reference (i'll do it right later)
export type TUUID = string | null | undefined;
/***********************************************************/

/***********************************************************/
//----- User Types -----\\
export type TUserAccount = {
  id: string,
  name: string,
  type: "checking" | "savings" | "wallet" | null,
  icon: string
};

export type TUserCategory = {
  id: string,
  name: string,
  icon: string,
  color: string,
  type: "income" | "expense" | null | undefined,
  parent: string | null | undefined,
  grandparent: string | null | undefined
};

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
/***********************************************************/

/***********************************************************/
//----- Financial Event Types -----\\
export type TFinancialEventType = "income" | "expense";

export type TFinancialEventPeriod = "monthly" | "quarterly" | "semi-annual" | "annual";

export type TFinancialEventCategory = {
  root: string | null | undefined,
  child: string | null | undefined,
  grandchild: string | null | undefined
};

export type TFinancialEvent = {
  id: string,
  name: string,
  user: TUUID,
  account: TUUID,
  type: TTransactionType,
  category: TTransactionCategory
  amount: number,
  reg_date: Date,
  due_date: Date,
}

export type TRecurrence = TFinancialEvent & {
  recurrence_period: TRecurringPeriod
};

export type TTransaction = TFinancialEvent & {
  confirmed: boolean,
  recurrence: TUUID,
  stallments: TUUID,
  stallments_count: number | null | undefined,
  stallments_current: number | null | undefined,
  stallments_period: TRecurringPeriod | null | undefined,
}; 
/***********************************************************/