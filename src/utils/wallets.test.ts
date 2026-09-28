import { describe, expect, it } from "vitest";
import type { Transaction, WalletData } from "../types";
import {
  calculateWalletBalances,
  getCreditCardPaymentDate,
  getCreditCardPayments,
} from "./wallets";

const cardSettings: WalletData["creditCardSettings"] = {
  closingDay: 31,
  paymentDay: 27,
  paymentWalletId: "bankAccount",
};

function expense(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: "transaction-1",
    type: "expense",
    amount: "10000",
    memo: "",
    date: "2026-09-10",
    source: "",
    majorCategoryId: "food",
    minorCategoryId: "groceries",
    paymentMethodId: "creditCard",
    scope: "personal",
    ...overrides,
  };
}

function walletData(): WalletData {
  return {
    openingBalances: {
      cash: 20_000,
      bankAccount: 100_000,
      bankAccountRisona: 50_000,
      digitalPayment: 5_000,
      creditCard: 0,
    },
    transfers: [],
    creditCardSettings: cardSettings,
  };
}

describe("クレカの引落日", () => {
  it("月末締めの利用分は翌月に引き落とす", () => {
    expect(getCreditCardPaymentDate("2026-09-10", cardSettings)).toBe("2026-10-27");
  });

  it("締め日を過ぎた利用分は翌々月に引き落とす", () => {
    const settings = { ...cardSettings, closingDay: 15 };
    expect(getCreditCardPaymentDate("2026-09-10", settings)).toBe("2026-10-27");
    expect(getCreditCardPaymentDate("2026-09-20", settings)).toBe("2026-11-27");
  });

  it("同じ引落日の利用額を一つにまとめる", () => {
    const payments = getCreditCardPayments(
      [expense(), expense({ id: "transaction-2", amount: "2500" })],
      cardSettings,
      new Date(2026, 8, 30),
    );
    expect(payments).toEqual([{ date: "2026-10-27", amount: 12_500 }]);
  });
});

describe("ウォレット残高", () => {
  it("未来日の支出は支払日まで残高に反映しない", () => {
    const balances = calculateWalletBalances(
      walletData(),
      [expense({ date: "2026-09-30", paymentMethodId: "cash" })],
      new Date(2026, 8, 29),
    );
    expect(balances.cash).toBe(20_000);
  });

  it("クレカ引落前は未払いだけを増やす", () => {
    const balances = calculateWalletBalances(
      walletData(),
      [expense()],
      new Date(2026, 9, 26),
    );
    expect(balances.creditCard).toBe(10_000);
    expect(balances.bankAccount).toBe(100_000);
  });

  it("引落日になると指定口座と未払い額を減らす", () => {
    const balances = calculateWalletBalances(
      walletData(),
      [expense()],
      new Date(2026, 9, 27),
    );
    expect(balances.creditCard).toBe(0);
    expect(balances.bankAccount).toBe(90_000);
  });
});
