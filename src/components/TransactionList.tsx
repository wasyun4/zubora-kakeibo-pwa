// 【収支・振替・レシート履歴一覧】
// すべての記録を日付順にまとめ、編集・削除する履歴をApp.tsxへ伝えます。

import { useState } from "react";
import type { Category } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Receipt, ReceiptItem, Transaction, WalletTransfer } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { walletNames } from "../utils/wallets";

type SelectionMode = "none" | "edit" | "delete";

type TransactionListProps = {
  transactions: Transaction[];
  transfers: WalletTransfer[];
  receipts: Receipt[];
  receiptItems: ReceiptItem[];
  categories: Category[];
  onEdit: (id: string) => void;
  onEditReceipt: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteTransfer: (id: string) => void;
  onDeleteReceipt: (id: string) => void;
};

function getPaymentMethodName(paymentMethodId: string) {
  return initialPaymentMethods.find((item) => item.id === paymentMethodId)?.name || "支払方法なし";
}

export default function TransactionList({ transactions, transfers, receipts, receiptItems, categories, onEdit, onEditReceipt, onDelete, onDeleteTransfer, onDeleteReceipt }: TransactionListProps) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");
  const [openReceiptId, setOpenReceiptId] = useState<string | null>(null);
  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const getCategoryName = (categoryId: string) => categories.find((item) => item.id === categoryId)?.name || "カテゴリなし";
  const historyItems = [
    ...transactions.map((transaction) => ({ kind: "transaction" as const, id: transaction.id, date: transaction.date, transaction })),
    ...transfers.map((transfer) => ({ kind: "transfer" as const, id: transfer.id, date: transfer.date, transfer })),
    ...receipts.map((receipt) => ({ kind: "receipt" as const, id: receipt.id, date: receipt.date, receipt })),
  ].sort((first, second) => second.date.localeCompare(first.date));

  function handleHistorySelect(item: (typeof historyItems)[number]) {
    if (selectionMode === "none") {
      if (item.kind === "receipt") setOpenReceiptId((current) => current === item.id ? null : item.id);
      return;
    }
    if (selectionMode === "edit") {
      if (item.kind === "transaction") onEdit(item.id);
      else if (item.kind === "receipt") onEditReceipt(item.id);
      else alert("振替は削除して登録し直してください。");
      setSelectionMode("none");
      return;
    }
    if (window.confirm("この履歴を削除しますか？")) {
      if (item.kind === "transaction") onDelete(item.id);
      else if (item.kind === "transfer") onDeleteTransfer(item.id);
      else onDeleteReceipt(item.id);
    }
    setSelectionMode("none");
  }

  return (
    <section>
      <h2>収支・振替・レシート履歴</h2>
      <div className="history-actions">
        <button type="button" className="edit-button" onClick={() => setSelectionMode(selectionMode === "edit" ? "none" : "edit")}>編集</button>
        <button type="button" className="delete-button" onClick={() => setSelectionMode(selectionMode === "delete" ? "none" : "delete")}>削除</button>
      </div>
      {selectionMode !== "none" && <p className="selection-guide">{selectionMode === "edit" ? "編集する収支またはレシートを選択してください。" : "削除する履歴を選択してください。"}</p>}

      {historyItems.length === 0 ? <p>この月の履歴はまだありません。</p> : <ul>
        {historyItems.map((item) => {
          if (item.kind === "transaction") return (
            <li key={`transaction-${item.id}`} className={`transaction-item ${selectionMode !== "none" ? "transaction-selectable" : ""}`} onClick={() => handleHistorySelect(item)}>
              <p className="transaction-date"><time dateTime={item.transaction.date}>{item.transaction.date || "日付なし"}</time>{item.transaction.type === "expense" && item.transaction.date > todayText && <span className="scheduled-badge">支払い予定</span>}</p>
              <div className="transaction-overview"><div><span className={`transaction-type ${item.transaction.type === "expense" ? "expense-type" : "income-type"}`}>{item.transaction.type === "expense" ? "支出" : "収入"}</span><strong className="transaction-category">{getCategoryName(item.transaction.minorCategoryId || item.transaction.majorCategoryId)}</strong></div><strong className={`transaction-amount ${item.transaction.type === "expense" ? "expense-amount" : "income-amount"}`}>{item.transaction.type === "expense" ? "－" : "＋"}{formatCurrency(item.transaction.amount)}</strong></div>
              <p className="transaction-memo">{item.transaction.memo || "メモなし"}</p>
              <div className="transaction-details"><span>{item.transaction.source || "収支元なし"}</span><span>{getCategoryName(item.transaction.majorCategoryId)}</span><span>{getPaymentMethodName(item.transaction.paymentMethodId)}</span><span>{item.transaction.scope === "shared" ? "共有" : "個人"}</span></div>
            </li>
          );
          if (item.kind === "transfer") return (
            <li key={`transfer-${item.id}`} className={`transaction-item transfer-item ${selectionMode !== "none" ? "transaction-selectable" : ""}`} onClick={() => handleHistorySelect(item)}>
              <p className="transaction-date"><time dateTime={item.transfer.date}>{item.transfer.date}</time></p>
              <div className="transaction-overview"><div><span className="transaction-type transfer-type">振替</span><strong className="transaction-category">{walletNames[item.transfer.from]} → {walletNames[item.transfer.to]}</strong></div><strong className="transaction-amount">{formatCurrency(item.transfer.amount)}</strong></div>
              <p className="transaction-memo">{item.transfer.memo || "メモなし"}</p>
            </li>
          );

          const items = receiptItems.filter((receiptItem) => receiptItem.receiptId === item.id);
          const isOpen = openReceiptId === item.id;
          return (
            <li key={`receipt-${item.id}`} className={`transaction-item receipt-history-item ${selectionMode !== "none" ? "transaction-selectable" : ""}`} onClick={() => handleHistorySelect(item)}>
              <p className="transaction-date"><time dateTime={item.receipt.date}>{item.receipt.date}</time></p>
              <div className="transaction-overview"><div><span className="transaction-type receipt-type">レシート</span><strong className="transaction-category">{item.receipt.storeName}</strong></div><strong className="transaction-amount expense-amount">－{formatCurrency(item.receipt.totalAmount)}</strong></div>
              <div className="transaction-details"><span>{getPaymentMethodName(item.receipt.paymentMethodId)}</span><span>{item.receipt.scope === "shared" ? "共有" : "個人"}</span><span>{items.length}商品</span><span>{isOpen ? "明細を閉じる ▲" : "明細を見る ▼"}</span></div>
              {isOpen && <ul className="receipt-history-details">{items.map((receiptItem) => <li key={receiptItem.id}><span>{receiptItem.name}<small>{getCategoryName(receiptItem.minorCategoryId || receiptItem.majorCategoryId)}</small></span><strong>{formatCurrency(receiptItem.amount)}</strong></li>)}</ul>}
            </li>
          );
        })}
      </ul>}
    </section>
  );
}
