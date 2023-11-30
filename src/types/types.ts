/***********************************************************/
//----- Utility Types -----\\

// Type for defining a uuid reference (i'll do it right later)
type TUUID = string | null | undefined;

/***********************************************************/
//----- User Types -----\\
type TUserAccount = {
  id: string,
  name: string,
  type: "checking" | "savings" | "wallet" | null,
  icon: string
};

type TUserCategory = {
  id: string,
  name: string,
  icon: string,
  color: string,
  type: "income" | "expense" | null | undefined,
  parent: string | null | undefined,
  grandparent: string | null | undefined
};

type TUser = {
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
    hide_scrollbars: boolean,
    dark_mode: boolean,
    show_category_icons: boolean
  }
};

/***********************************************************/
//----- Financial Event Types -----\\
type TFinancialEventType = "income" | "expense";

type TFinancialEventPeriod = "monthly" | "quarterly" | "semi-annual" | "annual";

type TFinancialEventCategory = {
  root: string | null | undefined,
  child: string | null | undefined,
  grandchild: string | null | undefined
};

type TFinancialEvent = {
  id: string,
  name: string,
  user: TUUID,
  account: TUUID,
  type: TFinancialEventType,
  category: TFinancialEventCategory
  amount: number,
  reg_date: Date,
  due_date: Date,
};

type TRecurrence = TFinancialEvent & {
  recurrence_period: TFinancialEventPeriod
};

type TTransaction = TFinancialEvent & {
  confirmation_date: Date | null | undefined,
  recurrence: TUUID,
  stallments: TUUID,
  stallments_count: number | null | undefined,
  stallments_current: number | null | undefined,
  stallments_period: TFinancialEventPeriod | null | undefined,
};