export type TransactionScope = "personal" | "shared";

export type EntryType = "income" | "expense" | "transfer";

export type Transaction = {
  id: string;
  type: string;
  amount: string;
  memo: string;
  date: string;
  source: string;
  majorCategoryId: string;
  minorCategoryId: string;
  paymentMethodId: string;
  scope: TransactionScope;
};

export type MonthlyBudget = {
  month: string;
  amount: number;
};

export type CategoryBudget = {
  month: string;
  majorCategoryId: string;
  amount: number;
};

export type WalletId = "cash" | "bankAccount" | "bankAccountRisona" | "digitalPayment" | "creditCard";

export type WalletTransfer = {
  id: string;
  date: string;
  from: WalletId;
  to: WalletId;
  amount: number;
  memo?: string;
};

export type WalletData = {
  openingBalances: Record<WalletId, number>;
  transfers: WalletTransfer[];
};

export type AppView =
  | "home"
  | "records"
  | "budget"
  | "analysis"
  | "settings";
