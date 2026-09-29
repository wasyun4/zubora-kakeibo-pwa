// 【レシートの計算と検算】
// 商品明細の合計とレシート合計が一致するかを確認します。

import type { Receipt, ReceiptItem } from "../types";

export function calculateReceiptItemsTotal(items: ReceiptItem[]) {
  return items.reduce((total, item) => total + item.amount * item.quantity, 0);
}

export function calculateReceiptTotal(items: ReceiptItem[], externalTaxAmount: number) {
  return calculateReceiptItemsTotal(items) + externalTaxAmount;
}

export function allocateExternalTax(items: ReceiptItem[], externalTaxAmount: number) {
  const subtotal = calculateReceiptItemsTotal(items);
  let allocatedTax = 0;

  return items.map((item, index) => {
    const netAmount = item.amount * item.quantity;
    const taxAmount = index === items.length - 1
      ? externalTaxAmount - allocatedTax
      : Math.floor(externalTaxAmount * netAmount / subtotal);
    allocatedTax += taxAmount;
    return {
      itemId: item.id,
      netAmount,
      taxAmount,
      totalAmount: netAmount + taxAmount,
    };
  });
}

export function getReceiptValidationError(
  receipt: Receipt,
  items: ReceiptItem[],
) {
  if (!receipt.date) return "日付を入力してください。";
  if (!receipt.storeName.trim()) return "店舗名を入力してください。";
  if (!Number.isFinite(receipt.totalAmount) || receipt.totalAmount <= 0) {
    return "レシート合計は1円以上で入力してください。";
  }
  if (items.length === 0) return "商品明細を1件以上追加してください。";
  if (items.some((item) => item.receiptId !== receipt.id)) {
    return "別のレシートの商品明細が含まれています。";
  }
  if (items.some((item) => !item.name.trim())) {
    return "商品名を入力してください。";
  }
  if (items.some((item) => !Number.isInteger(item.quantity) || item.quantity <= 0)) {
    return "商品の個数は1以上で入力してください。";
  }
  if (items.some((item) => !Number.isFinite(item.amount) || item.amount <= 0)) {
    return "商品金額は1円以上で入力してください。";
  }
  const externalTaxAmount = receipt.externalTaxAmount ?? 0;
  if (!Number.isFinite(externalTaxAmount) || externalTaxAmount < 0) {
    return "外税は0円以上で入力してください。";
  }
  if (calculateReceiptTotal(items, externalTaxAmount) !== receipt.totalAmount) {
    return "商品明細の合計とレシート合計が一致していません。";
  }

  return null;
}
