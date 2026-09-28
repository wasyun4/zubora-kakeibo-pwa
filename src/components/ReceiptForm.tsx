// 【レシート手入力フォーム】
// レシート情報と複数の商品明細をまとめて登録します。

import { useState } from "react";
import type { Category } from "../categories";
import type { PaymentMethod } from "../paymentMethods";
import type { Receipt, ReceiptItem, TransactionScope } from "../types";
import { createId } from "../utils/createId";
import { calculateReceiptItemsTotal, getReceiptValidationError } from "../utils/receipts";

type ReceiptFormProps = {
  categories: Category[];
  paymentMethods: PaymentMethod[];
  onSave: (receipt: Receipt, items: ReceiptItem[]) => void;
  onCancel: () => void;
};

function getTodayText() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export default function ReceiptForm({ categories, paymentMethods, onSave, onCancel }: ReceiptFormProps) {
  const [receiptId] = useState(createId);
  const [date, setDate] = useState(getTodayText);
  const [storeName, setStoreName] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [paymentMethodId, setPaymentMethodId] = useState("");
  const [scope, setScope] = useState<TransactionScope>("personal");
  const [memo, setMemo] = useState("");
  const [items, setItems] = useState<ReceiptItem[]>([]);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [majorCategoryId, setMajorCategoryId] = useState("");
  const [minorCategoryId, setMinorCategoryId] = useState("");

  const majorCategories = categories.filter((category) => category.type === "expense" && category.parentId === null && category.isActive);
  const minorCategories = categories.filter((category) => category.parentId === majorCategoryId && category.isActive);

  function addItem() {
    if (!itemName.trim() || Number(itemAmount) <= 0 || !majorCategoryId || !minorCategoryId) {
      alert("商品名・金額・カテゴリを入力してください。");
      return;
    }
    setItems((current) => [...current, {
      id: createId(),
      receiptId,
      name: itemName.trim(),
      quantity: 1,
      amount: Number(itemAmount),
      majorCategoryId,
      minorCategoryId,
    }]);
    setItemName("");
    setItemAmount("");
    setMajorCategoryId("");
    setMinorCategoryId("");
  }

  function saveReceipt() {
    if (!paymentMethodId) {
      alert("支払元を選択してください。");
      return;
    }
    const receipt: Receipt = {
      id: receiptId,
      date,
      storeName: storeName.trim(),
      totalAmount: Number(totalAmount),
      paymentMethodId,
      scope,
      memo,
    };
    const error = getReceiptValidationError(receipt, items);
    if (error) {
      alert(error);
      return;
    }
    onSave(receipt, items);
  }

  return (
    <section className="quick-entry receipt-entry">
      <div className="quick-entry-header">
        <h2 id="transaction-form-title">レシート入力</h2>
        <button type="button" className="entry-close" aria-label="レシート入力を閉じる" onClick={onCancel}>×</button>
      </div>

      <div className="entry-fields">
        <label>日付<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label>お店<input value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="例：スーパー" /></label>
        <label>レシート合計（円）<input type="text" inputMode="numeric" value={totalAmount} onChange={(event) => { if (/^\d*$/.test(event.target.value)) setTotalAmount(event.target.value); }} placeholder="0" /></label>
        <label>支払元<select value={paymentMethodId} onChange={(event) => setPaymentMethodId(event.target.value)}><option value="">選択してください</option>{paymentMethods.filter((method) => method.isActive).map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}</select></label>
        <label>個人・共有<select value={scope} onChange={(event) => setScope(event.target.value as TransactionScope)}><option value="personal">個人</option><option value="shared">共有</option></select></label>
        <label>メモ<input value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="任意" /></label>
      </div>

      <h3>商品明細</h3>
      {items.length > 0 && <ul className="receipt-item-list">{items.map((item) => <li key={item.id}><span>{item.name}</span><strong>{item.amount.toLocaleString("ja-JP")}円</strong><button type="button" aria-label={`${item.name}を削除`} onClick={() => setItems((current) => current.filter((entry) => entry.id !== item.id))}>×</button></li>)}</ul>}
      <div className="receipt-item-editor">
        <label>商品名<input value={itemName} onChange={(event) => setItemName(event.target.value)} /></label>
        <label>金額（円）<input type="text" inputMode="numeric" value={itemAmount} onChange={(event) => { if (/^\d*$/.test(event.target.value)) setItemAmount(event.target.value); }} /></label>
        <label>大カテゴリ<select value={majorCategoryId} onChange={(event) => { setMajorCategoryId(event.target.value); setMinorCategoryId(""); }}><option value="">選択してください</option>{majorCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <label>小カテゴリ<select value={minorCategoryId} onChange={(event) => setMinorCategoryId(event.target.value)} disabled={!majorCategoryId}><option value="">選択してください</option>{minorCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
        <button type="button" className="secondary-button" onClick={addItem}>商品を追加</button>
      </div>
      <p className="receipt-items-total">明細合計：<strong>{calculateReceiptItemsTotal(items).toLocaleString("ja-JP")}円</strong></p>

      <div className="entry-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>キャンセル</button>
        <button type="button" onClick={saveReceipt}>登録する</button>
      </div>
    </section>
  );
}
