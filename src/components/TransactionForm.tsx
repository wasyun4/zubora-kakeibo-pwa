// 【収支入力フォーム】
// 収入・支出の入力欄を表示し、入力内容や登録操作をApp.tsxへ伝える部品です。

import type { Category } from "../categories";
import type { PaymentMethod } from "../paymentMethods";
import type { EntryType, TransactionScope, WalletId } from "../types";
import { walletIds, walletNames } from "../utils/wallets";

type TransactionFormProps = {
    type: EntryType;
    majorCategoryId: string;
    minorCategoryId: string;
    amount: string;
    memo: string;
    date: string;
    source: string;
    paymentMethodId: string;
    scope: TransactionScope;
    transferFrom: WalletId;
    transferTo: WalletId;
    editingTransactionId: string | null;
    incomeCategories: Category[];
    expenseMajorCategories: Category[];
    expenseMinorCategories: Category[];
    paymentMethods: PaymentMethod[];
    onTypeChange: (value: EntryType) => void;
    onMajorCategoryChange: (value: string) => void;
    onMinorCategoryChange: (value: string) => void;
    onAmountChange: (value: string) => void;
    onMemoChange: (value: string) => void;
    onDateChange: (value: string) => void;
    onSourceChange: (value: string) => void;
    onPaymentMethodChange: (value: string) => void;
    onScopeChange: (value: TransactionScope) => void;
    onTransferFromChange: (value: WalletId) => void;
    onTransferToChange: (value: WalletId) => void;
    onSubmit: () => void;
    onCancel: () => void;
};

function TransactionForm(props: TransactionFormProps) {
    const categories = props.type === "income" ? props.incomeCategories : props.expenseMajorCategories;
    const isTransfer = props.type === "transfer";

    function shiftDate(days: number) {
        const day = props.date ? new Date(`${props.date}T12:00:00`) : new Date();
        day.setDate(day.getDate() + days);
        props.onDateChange(`${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`);
    }

    function appendDigit(digit: string) {
        const next = `${props.amount}${digit}`.replace(/^0+(?=\d)/, "");
        if (next.length <= 12) props.onAmountChange(next);
    }

    return (
        <section className="quick-entry">
            <div className="quick-entry-header">
                <h2 id="transaction-form-title">{props.editingTransactionId === null ? "入力" : "収支の編集"}</h2>
                <button type="button" className="entry-close" aria-label="入力を閉じる" onClick={props.onCancel}>×</button>
            </div>

            <div className="entry-types" role="group" aria-label="入力の種類">
                {[
                    { id: "income", label: "収入" },
                    { id: "expense", label: "支出" },
                    { id: "transfer", label: "振替" },
                ].map((item) => (
                    <button key={item.id} type="button" aria-pressed={props.type === item.id}
                        disabled={props.editingTransactionId !== null && item.id === "transfer"}
                        onClick={() => { if (props.type !== item.id) props.onTypeChange(item.id as EntryType); }}>{item.label}</button>
                ))}
            </div>

            <div className="entry-date-row">
                <label>日付<input type="date" value={props.date} onChange={(event) => props.onDateChange(event.target.value)} /></label>
                <button type="button" aria-label="前日" onClick={() => shiftDate(-1)}>‹</button>
                <button type="button" aria-label="翌日" onClick={() => shiftDate(1)}>›</button>
            </div>

            {!isTransfer && <div className="entry-fields">
                <label>{props.type === "income" ? "収入カテゴリ" : "大カテゴリ"}
                    <select value={props.majorCategoryId} onChange={(event) => props.onMajorCategoryChange(event.target.value)}>
                        <option value="">選択してください</option>
                        {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                </label>
                {props.type === "expense" && <label>小カテゴリ
                    <select disabled={!props.majorCategoryId} value={props.minorCategoryId} onChange={(event) => props.onMinorCategoryChange(event.target.value)}>
                        <option value="">{props.majorCategoryId ? "選択してください" : "大カテゴリを選択"}</option>
                        {props.expenseMinorCategories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
                    </select>
                </label>}
                <label>{props.type === "income" ? "収入元" : "お店・場所"}<input type="text" value={props.source} onChange={(event) => props.onSourceChange(event.target.value)} placeholder="任意" /></label>
                <label>メモ<input type="text" value={props.memo} onChange={(event) => props.onMemoChange(event.target.value)} placeholder="任意" /></label>
            </div>}

            {isTransfer && <div className="entry-fields entry-transfer">
                <label>移動元
                    <select value={props.transferFrom} onChange={(event) => props.onTransferFromChange(event.target.value as WalletId)}>
                        {walletIds.filter((id) => id !== "creditCard").map((id) => <option key={id} value={id}>{walletNames[id]}</option>)}
                    </select>
                </label>
                <label>移動先
                    <select value={props.transferTo} onChange={(event) => props.onTransferToChange(event.target.value as WalletId)}>
                        {walletIds.map((id) => <option key={id} value={id}>{walletNames[id]}</option>)}
                    </select>
                </label>
                <label className="entry-transfer-memo">メモ
                    <input type="text" value={props.memo} onChange={(event) => props.onMemoChange(event.target.value)} placeholder="任意" />
                </label>
            </div>}

            <label className="entry-amount">金額（円）
                <input type="text" inputMode="numeric" pattern="[0-9]*" maxLength={12} placeholder="0" autoComplete="off"
                    value={props.amount} onChange={(event) => { if (/^\d*$/.test(event.target.value)) props.onAmountChange(event.target.value); }} />
            </label>
            <div className="entry-keypad" role="group" aria-label="金額の数字キー">
                {["7", "8", "9", "4", "5", "6", "1", "2", "3"].map((digit) => (
                    <button key={digit} type="button" onClick={() => appendDigit(digit)}>{digit}</button>
                ))}
                <button type="button" className="entry-key-action" aria-label="金額をクリア" onClick={() => props.onAmountChange("")}>クリア</button>
                <button type="button" onClick={() => appendDigit("0")}>0</button>
                <button type="button" className="entry-key-action" aria-label="金額を1桁削除" onClick={() => props.onAmountChange(props.amount.slice(0, -1))}>⌫</button>
            </div>

            {!isTransfer && <div className="entry-fields entry-payment">
                <label>{props.type === "income" ? "入金先" : "支払元"}
                    <select value={props.paymentMethodId} onChange={(event) => props.onPaymentMethodChange(event.target.value)}>
                        <option value="">選択してください</option>
                        {props.paymentMethods.filter((method) => method.isActive).map((method) => <option key={method.id} value={method.id}>{method.name}</option>)}
                    </select>
                </label>
                <label>個人・共有
                    <select value={props.scope} onChange={(event) => props.onScopeChange(event.target.value as TransactionScope)}>
                        <option value="personal">個人</option><option value="shared">共有</option>
                    </select>
                </label>
            </div>}
            <div className="entry-actions">
                <button type="button" className="cancel-button" onClick={props.onCancel}>キャンセル</button>
                <button type="button" onClick={props.onSubmit}>{props.editingTransactionId === null ? "登録する" : "更新する"}</button>
            </div>
        </section>
    );
}
export default TransactionForm;
