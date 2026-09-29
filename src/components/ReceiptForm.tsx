// 【レシート手入力フォーム】
// レシート情報と複数の商品明細をまとめて登録・編集します。

import { useState } from "react";
import type { Category } from "../categories";
import type { PaymentMethod } from "../paymentMethods";
import type { Receipt, ReceiptItem, TransactionScope } from "../types";
import { createId } from "../utils/createId";
import { calculateReceiptItemsTotal, calculateReceiptTotal, getReceiptValidationError } from "../utils/receipts";
import ExpenseCategoryPicker from "./ExpenseCategoryPicker";

type ReceiptFormProps = {
  categories: Category[];
  paymentMethods: PaymentMethod[];
  initialReceipt?: Receipt;
  initialItems?: ReceiptItem[];
  onSave: (receipt: Receipt, items: ReceiptItem[]) => void;
  onCancel: () => void;
};

function getTodayText() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

export default function ReceiptForm({ categories, paymentMethods, initialReceipt, initialItems = [], onSave, onCancel }: ReceiptFormProps) {
  const [receiptId] = useState(() => initialReceipt?.id ?? createId());
  const [date, setDate] = useState(initialReceipt?.date ?? getTodayText());
  const [storeName, setStoreName] = useState(initialReceipt?.storeName ?? "");
  const [externalTaxAmount, setExternalTaxAmount] = useState(String(initialReceipt?.externalTaxAmount ?? 0));
  const [paymentMethodId, setPaymentMethodId] = useState(initialReceipt?.paymentMethodId ?? "");
  const [scope, setScope] = useState<TransactionScope>(initialReceipt?.scope ?? "personal");
  const [memo, setMemo] = useState(initialReceipt?.memo ?? "");
  const [items, setItems] = useState<ReceiptItem[]>(initialItems);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [itemAmount, setItemAmount] = useState("");
  const [itemQuantity, setItemQuantity] = useState("1");
  const [majorCategoryId, setMajorCategoryId] = useState("");
  const [minorCategoryId, setMinorCategoryId] = useState("");

  const majorCategories = categories.filter((category) => category.type === "expense" && category.parentId === null && category.isActive);
  const minorCategories = categories.filter((category) => category.type === "expense" && category.parentId !== null && category.isActive);
  const itemsTotal = calculateReceiptItemsTotal(items);
  const receiptTotal = calculateReceiptTotal(items, Number(externalTaxAmount) || 0);

  function clearItemEditor() {
    setEditingItemId(null);
    setItemName("");
    setItemAmount("");
    setItemQuantity("1");
    setMajorCategoryId("");
    setMinorCategoryId("");
  }

  function saveItem() {
    const amount = Number(itemAmount);
    const quantity = Number(itemQuantity);
    const majorHasMinorCategories = minorCategories.some((category) => category.parentId === majorCategoryId);
    if (!itemName.trim() || amount <= 0 || !Number.isInteger(quantity) || quantity <= 0 || !majorCategoryId || (majorHasMinorCategories && !minorCategoryId)) {
      alert("商品名・単価・数量・カテゴリを入力してください。");
      return;
    }
    const item: ReceiptItem = {
      id: editingItemId ?? createId(), receiptId, name: itemName.trim(),
      quantity, amount, majorCategoryId, minorCategoryId,
    };
    setItems((current) => editingItemId
      ? current.map((entry) => entry.id === editingItemId ? item : entry)
      : [...current, item]);
    clearItemEditor();
  }

  function startItemEdit(item: ReceiptItem) {
    setEditingItemId(item.id);
    setItemName(item.name);
    setItemAmount(String(item.amount));
    setItemQuantity(String(item.quantity));
    setMajorCategoryId(item.majorCategoryId);
    setMinorCategoryId(item.minorCategoryId);
  }

  function saveReceipt() {
    if (!paymentMethodId) {
      alert("支払元を選択してください。");
      return;
    }
    const receipt: Receipt = {
      id: receiptId, date, storeName: storeName.trim(), totalAmount: receiptTotal,
      externalTaxAmount: Number(externalTaxAmount) || 0,
      paymentMethodId, scope, memo,
    };
    const error = getReceiptValidationError(receipt, items);
    if (error) return alert(error);
    onSave(receipt, items);
  }

  return (
    <section className="quick-entry receipt-entry">
      <div className="quick-entry-header">
        <h2 id="transaction-form-title">{initialReceipt ? "レシート編集" : "レシート手入力"}</h2>
        <button type="button" className="entry-close" aria-label="レシート入力を閉じる" onClick={onCancel}>×</button>
      </div>

      <div className="receipt-header-fields">
        <label className="receipt-date-field">日付<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label>お店<input value={storeName} onChange={(event) => setStoreName(event.target.value)} placeholder="例：スーパー" /></label>
        <label>支払元<select value={paymentMethodId} onChange={(event) => setPaymentMethodId(event.target.value)}><option value="">選択してください</option>{paymentMethods.filter((method) => method.isActive).map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}</select></label>
        <label>個人・共有<select value={scope} onChange={(event) => setScope(event.target.value as TransactionScope)}><option value="personal">個人</option><option value="shared">共有</option></select></label>
        <label className="receipt-wide-field">メモ<input value={memo} onChange={(event) => setMemo(event.target.value)} placeholder="任意" /></label>
      </div>

      <h3>商品明細</h3>
      {items.length > 0 && <ul className="receipt-item-list">{items.map((item) => <li key={item.id}>
        <button type="button" className="receipt-item-main" onClick={() => startItemEdit(item)}><span>{item.name}<small>{item.quantity}個 × {item.amount.toLocaleString("ja-JP")}円</small></span><strong>{(item.amount * item.quantity).toLocaleString("ja-JP")}円</strong></button>
        <button type="button" aria-label={`${item.name}を削除`} onClick={() => { setItems((current) => current.filter((entry) => entry.id !== item.id)); if (editingItemId === item.id) clearItemEditor(); }}>×</button>
      </li>)}</ul>}

      <div className="receipt-item-editor">
        <div className="receipt-item-fields">
          <label>商品名<input value={itemName} onChange={(event) => setItemName(event.target.value)} /></label>
          <label>単価（円）<input type="text" inputMode="numeric" value={itemAmount} onChange={(event) => { if (/^\d*$/.test(event.target.value)) setItemAmount(event.target.value); }} /></label>
          <label>数量<input type="number" inputMode="numeric" min="1" value={itemQuantity} onChange={(event) => setItemQuantity(event.target.value)} /></label>
        </div>
        <div className="entry-category-field"><span>カテゴリ</span><ExpenseCategoryPicker majorCategories={majorCategories} minorCategories={minorCategories} majorCategoryId={majorCategoryId} minorCategoryId={minorCategoryId} onChange={(major, minor) => { setMajorCategoryId(major); setMinorCategoryId(minor); }} /></div>
        <div className="receipt-item-actions">
          {editingItemId && <button type="button" className="secondary-button" onClick={clearItemEditor}>編集取消</button>}
          <button type="button" className="secondary-button" onClick={saveItem}>{editingItemId ? "商品を更新" : "商品を追加"}</button>
        </div>
      </div>

      <div className="receipt-total-box">
        <p>商品明細合計 <strong>{itemsTotal.toLocaleString("ja-JP")}円</strong></p>
        <label>外税（円）<input type="text" inputMode="numeric" value={externalTaxAmount} onChange={(event) => { if (/^\d*$/.test(event.target.value)) setExternalTaxAmount(event.target.value); }} /></label>
        <p className="receipt-grand-total">レシート合計 <strong>{receiptTotal.toLocaleString("ja-JP")}円</strong></p>
      </div>

      <div className="entry-actions"><button type="button" className="cancel-button" onClick={onCancel}>キャンセル</button><button type="button" onClick={saveReceipt}>{initialReceipt ? "更新する" : "登録する"}</button></div>
    </section>
  );
}
