// 【ウォレット残高の計算】
// 開始額に収支と資金移動を反映します。クレカだけは未払い額として扱います。
import type { Transaction, WalletData, WalletId } from "../types";

export const walletIds: WalletId[] = [
  "cash", "bankAccount", "bankAccountRisona", "digitalPayment", "creditCard",
];

export const walletNames: Record<WalletId, string> = {
  cash: "現金",
  bankAccount: "福銀",
  bankAccountRisona: "りそな",
  digitalPayment: "QR・電子マネー",
  creditCard: "クレカ未払い",
};

export const emptyWalletData: WalletData = {
  openingBalances: {
    cash: 0,
    bankAccount: 0,
    bankAccountRisona: 0,
    digitalPayment: 0,
    creditCard: 0,
  },
  transfers: [],
  creditCardSettings: {
    closingDay: 31,
    paymentDay: 27,
    paymentWalletId: "bankAccount",
  },
};

function formatDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function getCreditCardPaymentDate(
  purchaseDate: string,
  settings: WalletData["creditCardSettings"],
) {
  const [year, month, day] = purchaseDate.split("-").map(Number);
  const afterClosingDay = settings.closingDay < 31 && day > settings.closingDay;
  const paymentMonth = new Date(year, month - 1 + (afterClosingDay ? 2 : 1), 1);
  const lastDay = new Date(paymentMonth.getFullYear(), paymentMonth.getMonth() + 1, 0).getDate();
  paymentMonth.setDate(Math.min(settings.paymentDay, lastDay));
  return formatDate(paymentMonth);
}

export function getCreditCardPayments(
  transactions: Transaction[],
  settings: WalletData["creditCardSettings"],
  today = new Date(),
) {
  const todayText = formatDate(today);
  const payments = new Map<string, number>();

  for (const transaction of transactions) {
    if (
      transaction.type !== "expense" ||
      transaction.paymentMethodId !== "creditCard" ||
      transaction.date > todayText
    ) continue;

    const paymentDate = getCreditCardPaymentDate(transaction.date, settings);
    payments.set(paymentDate, (payments.get(paymentDate) ?? 0) + Number(transaction.amount));
  }

  return [...payments.entries()]
    .map(([date, amount]) => ({ date, amount }))
    .sort((first, second) => first.date.localeCompare(second.date));
}

export function calculateWalletBalances(
  walletData: WalletData,
  transactions: Transaction[],
  today = new Date(),
): Record<WalletId, number> {
  const balances = { ...walletData.openingBalances };
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  for (const transaction of transactions) {
    if (transaction.date > todayText) continue;

    const walletId = transaction.paymentMethodId as WalletId;
    if (!walletIds.includes(walletId)) continue;
    const amount = Number(transaction.amount);
    if (!Number.isFinite(amount) || amount <= 0) continue;

    if (walletId === "creditCard") {
      if (transaction.type === "expense") balances.creditCard += amount;
    } else if (transaction.type === "income") {
      balances[walletId] += amount;
    } else if (transaction.type === "expense") {
      balances[walletId] -= amount;
    }
  }

  for (const transfer of walletData.transfers) {
    if (transfer.date > todayText) continue;

    if (transfer.from === "creditCard" || transfer.from === transfer.to) continue;
    if (!Number.isFinite(transfer.amount) || transfer.amount <= 0) continue;
    balances[transfer.from] -= transfer.amount;
    if (transfer.to === "creditCard") {
      balances.creditCard -= transfer.amount;
    } else {
      balances[transfer.to] += transfer.amount;
    }
  }

  for (const payment of getCreditCardPayments(
    transactions,
    walletData.creditCardSettings,
    today,
  )) {
    if (payment.date > todayText) continue;
    balances[walletData.creditCardSettings.paymentWalletId] -= payment.amount;
    balances.creditCard -= payment.amount;
  }

  return balances;
}
