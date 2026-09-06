// 【収支履歴一覧】
// 登録済みの収支を一覧表示し、編集・削除するIDをApp.tsxへ伝える部品です。

import { initialCategories } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/formatCurrency";

type TransactionListProps = {
    transactions: Transaction[];
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
};

function getCategoryName(categoryId: string) {
    const category = initialCategories.find(
        (item) => item.id === categoryId,
    );

    return category?.name || "カテゴリなし";
}

function getPaymentMethodName(paymentMethodId: string) {
    const paymentMethod = initialPaymentMethods.find(
        (item) => item.id === paymentMethodId,
    );

    return paymentMethod?.name || "支払方法なし";
}

function TransactionList({
    transactions,
    onEdit,
    onDelete,
}: TransactionListProps) {
    return (
        <section>
            <h2>収支履歴</h2>

            <ul>
                {transactions.map((transaction) => (
                    <li
                        key={transaction.id}
                        className="transaction-item"
                    >
                        <div className="transaction-overview">
                            <div>
                                <span
                                    className={
                                        transaction.type === "expense"
                                            ? "transaction-type expense-type"
                                            : "transaction-type income-type"
                                    }
                                >
                                    {transaction.type === "expense" ? "支出" : "収入"}
                                </span>

                                <strong className="transaction-category">
                                    {getCategoryName(
                                        transaction.minorCategoryId ||
                                        transaction.majorCategoryId,
                                    )}
                                </strong>
                            </div>

                            <strong
                                className={
                                    transaction.type === "expense"
                                        ? "transaction-amount expense-amount"
                                        : "transaction-amount income-amount"
                                }
                            >
                                {transaction.type === "expense" ? "－" : "＋"}
                                {formatCurrency(transaction.amount)}
                            </strong>
                        </div>

                        <p className="transaction-memo">
                            {transaction.memo || "メモなし"}
                        </p>

                        <div className="transaction-details">
                            <span>{transaction.date || "日付なし"}</span>
                            <span>{transaction.source || "収支元なし"}</span>
                            <span>
                                {getCategoryName(transaction.majorCategoryId)}
                            </span>
                            <span>
                                {getPaymentMethodName(transaction.paymentMethodId)}
                            </span>
                            <span>
                                {transaction.scope === "shared" ? "共有" : "個人"}
                            </span>
                        </div>

                        <div className="transaction-actions">
                            <button
                                className="edit-button"
                                onClick={() => onEdit(transaction.id)}
                            >
                                編集
                            </button>

                            <button
                                className="delete-button"
                                onClick={() => onDelete(transaction.id)}
                            >
                                削除
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TransactionList;
