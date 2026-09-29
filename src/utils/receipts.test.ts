import { describe, expect, it } from "vitest";
import type { Receipt, ReceiptItem } from "../types";
import {
  calculateReceiptItemsTotal,
  calculateReceiptTotal,
  allocateExternalTax,
  getReceiptValidationError,
} from "./receipts";

const receipt: Receipt = {
  id: "receipt-1",
  date: "2026-09-29",
  storeName: "スーパー",
  totalAmount: 500,
  paymentMethodId: "cash",
  scope: "personal",
  memo: "",
};

const items: ReceiptItem[] = [
  {
    id: "item-1",
    receiptId: receipt.id,
    name: "パン",
    quantity: 1,
    amount: 200,
    majorCategoryId: "food",
    minorCategoryId: "groceries",
  },
  {
    id: "item-2",
    receiptId: receipt.id,
    name: "飲み物",
    quantity: 2,
    amount: 150,
    majorCategoryId: "food",
    minorCategoryId: "beverages",
  },
];

describe("receipt calculations", () => {
  it("calculates the item total", () => {
    expect(calculateReceiptItemsTotal(items)).toBe(500);
  });

  it("adds external tax to the receipt total", () => {
    expect(calculateReceiptTotal(items, 45)).toBe(545);
  });

  it("allocates external tax by item amount and gives the remainder to the last item", () => {
    const allocated = allocateExternalTax(items, 101);
    expect(allocated.map((item) => item.totalAmount)).toEqual([240, 361]);
    expect(allocated.reduce((sum, item) => sum + item.totalAmount, 0)).toBe(601);
  });

  it("accepts a valid receipt", () => {
    expect(getReceiptValidationError(receipt, items)).toBeNull();
  });

  it("rejects a receipt whose total differs from its items", () => {
    expect(
      getReceiptValidationError({ ...receipt, totalAmount: 600 }, items),
    ).toContain("一致していません");
  });

  it("rejects items belonging to another receipt", () => {
    expect(
      getReceiptValidationError(receipt, [
        { ...items[0], receiptId: "receipt-2", amount: 500 },
      ]),
    ).toContain("別のレシート");
  });
});
