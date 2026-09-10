// 【CSVファイルの出力】
// 収支履歴をExcelでも読みやすいCSVファイルとして保存します。

import { initialCategories } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Transaction } from "../types";

function escapeCsv(value: string | number) {
    const text = String(value).replace(/"/g, '""');

    return `"${text}"`;
}

export function downloadTransactionsCsv(
    transactions: Transaction[],
) {
    const header = [
        "日付",
        "種類",
        "金額",
        "大カテゴリ",
        "小カテゴリ",
        "店舗・収入元",
        "メモ",
        "支払方法",
        "範囲",
    ];

    const rows = transactions.map((transaction) => {
        const majorCategory = initialCategories.find(
            (category) =>
                category.id === transaction.majorCategoryId,
        );

        const minorCategory = initialCategories.find(
            (category) =>
                category.id === transaction.minorCategoryId,
        );

        const paymentMethod = initialPaymentMethods.find(
            (method) =>
                method.id === transaction.paymentMethodId,
        );

        return [
            transaction.date,
            transaction.type === "income" ? "収入" : "支出",
            transaction.amount,
            majorCategory?.name ?? "",
            minorCategory?.name ?? "",
            transaction.source,
            transaction.memo,
            paymentMethod?.name ?? "",
            transaction.scope === "shared" ? "共有" : "個人",
        ];
    });

    const csvText = [header, ...rows]
        .map((row) => row.map(escapeCsv).join(","))
        .join("\r\n");

    const file = new Blob(
        ["\uFEFF", csvText],
        { type: "text/csv;charset=utf-8" },
    );

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = downloadUrl;
    link.download = `kakeibo-${today}.csv`;
    link.click();

    URL.revokeObjectURL(downloadUrl);
}