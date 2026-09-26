// 【収支履歴一覧】
// 登録済みの収支を一覧表示し、編集・削除するIDをApp.tsxへ伝える部品です。

import { initialCategories } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Transaction } from "../types";
import { formatCurrency } from "../utils/formatCurrency";
import { useState } from "react";

type SelectionMode = "none" | "edit" | "delete";

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
    const [selectionMode, setSelectionMode] =
        useState<SelectionMode>("none");

    function handleTransactionSelect(id: string) {
        if (selectionMode === "edit") {
            onEdit(id);
            setSelectionMode("none");
        }

        if (selectionMode === "delete") {
            const shouldDelete = window.confirm(
                "この履歴を削除しますか？",
            );

            if (shouldDelete) {
                onDelete(id);
            }

            setSelectionMode("none");
        }
    }
    return (
        <section>
            <h2>収支履歴</h2>

            <div className="history-actions">
                <button
                    type="button"
                    className="edit-button"
                    onClick={() =>
                        setSelectionMode(
                            selectionMode === "edit" ? "none" : "edit",
                        )
                    }
                >
                    編集
                </button>

                <button
                    type="button"
                    className="delete-button"
                    onClick={() =>
                        setSelectionMode(
                            selectionMode === "delete" ? "none" : "delete",
                        )
                    }
                >
                    削除
                </button>
            </div>

            {selectionMode !== "none" && (
                <p className="selection-guide">
                    {selectionMode === "edit"
                        ? "編集する履歴を選択してください。"
                        : "削除する履歴を選択してください。"}
                </p>
            )}

            <ul>
                {transactions.map((transaction) => (
                    <li
                        key={transaction.id}
                        className={`transaction-item ${selectionMode !== "none"
                            ? "transaction-selectable"
                            : ""
                            }`}
                        onClick={() =>
                            handleTransactionSelect(transaction.id)
                        }
                    >
                        <p className="transaction-date">
                            {transaction.date ? (
                                <time dateTime={transaction.date}>{transaction.date}</time>
                            ) : "日付なし"}
                        </p>
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

                    </li>
                ))}
            </ul>
        </section>
    );
}

export default TransactionList;
