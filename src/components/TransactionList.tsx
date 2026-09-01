import { initialCategories } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Transaction } from "../types";

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
                    <li key={transaction.id}>
                        {transaction.type === "expense" ? "支出" : "収入"}：
                        {transaction.date || "日付なし"}：
                        {transaction.amount}円：
                        {transaction.memo || "メモなし"}：
                        {transaction.source || "収支元なし"}：
                        {getCategoryName(transaction.majorCategoryId)}
                        {transaction.type === "expense" &&
                            `：${getCategoryName(
                                transaction.minorCategoryId,
                            )}`}
                        ：
                        {getPaymentMethodName(
                            transaction.paymentMethodId,
                        )}
                        ：
                        {transaction.scope === "shared"
                            ? "共有"
                            : "個人"}

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