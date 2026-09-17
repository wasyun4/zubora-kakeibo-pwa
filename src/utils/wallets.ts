// 【ウォレット残高の計算】
// 開始額に収支と資金移動を反映します。クレカだけは未払い額として扱います。
import type { Transaction, WalletData, WalletId } from "../types";

export const walletIds: WalletId[] = [
  "cash", "bankAccount", "digitalPayment", "creditCard",
];

export const walletNames: Record<WalletId, string> = {
  cash: "現金",
  bankAccount: "銀行口座",
  digitalPayment: "QR・電子マネー",
  creditCard: "クレカ未払い",
};

export const emptyWalletData: WalletData = {
  openingBalances: {
    cash: 0,
    bankAccount: 0,
    digitalPayment: 0,
    creditCard: 0,
  },
  transfers: [],
};

export function calculateWalletBalances(
  walletData: WalletData,
  transactions: Transaction[],
): Record<WalletId, number> {
  const balances = { ...walletData.openingBalances };

  for (const transaction of transactions) {
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
    if (transfer.from === "creditCard" || transfer.from === transfer.to) continue;
    if (!Number.isFinite(transfer.amount) || transfer.amount <= 0) continue;
    balances[transfer.from] -= transfer.amount;
    if (transfer.to === "creditCard") {
      balances.creditCard -= transfer.amount;
    } else {
      balances[transfer.to] += transfer.amount;
    }
  }

  return balances;
}
