// 【収支・振替履歴一覧】
// 収支と振替を日付順にまとめ、編集・削除する履歴をApp.tsxへ伝えます。

import { useState } from "react";
import { initialCategories } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Transaction, WalletTransfer } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { walletNames } from "../utils/wallets";

type SelectionMode = "none" | "edit" | "delete";

type TransactionListProps = {
  transactions: Transaction[];
  transfers: WalletTransfer[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onDeleteTransfer: (id: string) => void;
};

function getCategoryName(categoryId: string) {
  return initialCategories.find((item) => item.id === categoryId)?.name || "カテゴリなし";
}

function getPaymentMethodName(paymentMethodId: string) {
  return initialPaymentMethods.find((item) => item.id === paymentMethodId)?.name || "支払方法なし";
}

function TransactionList({ transactions, transfers, onEdit, onDelete, onDeleteTransfer }: TransactionListProps) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>("none");
  const today = new Date();
  const todayText = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const historyItems = [
    ...transactions.map((transaction) => ({ kind: "transaction" as const, id: transaction.id, date: transaction.date, transaction })),
    ...transfers.map((transfer) => ({ kind: "transfer" as const, id: transfer.id, date: transfer.date, transfer })),
  ].sort((first, second) => second.date.localeCompare(first.date));

  function handleHistorySelect(item: (typeof historyItems)[number]) {
    if (selectionMode === "edit") {
      if (item.kind === "transfer") alert("振替は削除して登録し直してください。");
      else onEdit(item.id);
      setSelectionMode("none");
    }

    if (selectionMode === "delete") {
      if (window.confirm("この履歴を削除しますか？")) {
        if (item.kind === "transfer") onDeleteTransfer(item.id);
        else onDelete(item.id);
      }
      setSelectionMode("none");
    }
  }

  return (
    <section>
      <h2>収支・振替履歴</h2>
      <div className="history-actions">
        <button type="button" className="edit-button" onClick={() => setSelectionMode(selectionMode === "edit" ? "none" : "edit")}>編集</button>
        <button type="button" className="delete-button" onClick={() => setSelectionMode(selectionMode === "delete" ? "none" : "delete")}>削除</button>
      </div>

      {selectionMode !== "none" && (
        <p className="selection-guide">
          {selectionMode === "edit" ? "編集する収支を選択してください。振替は削除後に登録し直します。" : "削除する履歴を選択してください。"}
        </p>
      )}

      {historyItems.length === 0 ? <p>この月の履歴はまだありません。</p> : (
        <ul>
          {historyItems.map((item) => item.kind === "transaction" ? (
            <li key={`transaction-${item.id}`} className={`transaction-item ${selectionMode !== "none" ? "transaction-selectable" : ""}`} onClick={() => handleHistorySelect(item)}>
              <p className="transaction-date">
                {item.transaction.date ? <time dateTime={item.transaction.date}>{item.transaction.date}</time> : "日付なし"}
                {item.transaction.type === "expense" && item.transaction.date > todayText && <span className="scheduled-badge">支払い予定</span>}
              </p>
              <div className="transaction-overview">
                <div>
                  <span className={`transaction-type ${item.transaction.type === "expense" ? "expense-type" : "income-type"}`}>{item.transaction.type === "expense" ? "支出" : "収入"}</span>
                  <strong className="transaction-category">{getCategoryName(item.transaction.minorCategoryId || item.transaction.majorCategoryId)}</strong>
                </div>
                <strong className={`transaction-amount ${item.transaction.type === "expense" ? "expense-amount" : "income-amount"}`}>
                  {item.transaction.type === "expense" ? "－" : "＋"}{formatCurrency(item.transaction.amount)}
                </strong>
              </div>
              <p className="transaction-memo">{item.transaction.memo || "メモなし"}</p>
              <div className="transaction-details">
                <span>{item.transaction.source || "収支元なし"}</span>
                <span>{getCategoryName(item.transaction.majorCategoryId)}</span>
                <span>{getPaymentMethodName(item.transaction.paymentMethodId)}</span>
                <span>{item.transaction.scope === "shared" ? "共有" : "個人"}</span>
              </div>
            </li>
          ) : (
            <li key={`transfer-${item.id}`} className={`transaction-item transfer-item ${selectionMode !== "none" ? "transaction-selectable" : ""}`} onClick={() => handleHistorySelect(item)}>
              <p className="transaction-date"><time dateTime={item.transfer.date}>{item.transfer.date}</time></p>
              <div className="transaction-overview">
                <div>
                  <span className="transaction-type transfer-type">振替</span>
                  <strong className="transaction-category">{walletNames[item.transfer.from]} → {walletNames[item.transfer.to]}</strong>
                </div>
                <strong className="transaction-amount">{formatCurrency(item.transfer.amount)}</strong>
              </div>
              <p className="transaction-memo">{item.transfer.memo || "メモなし"}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TransactionList;
