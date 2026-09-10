// 【CSVファイルの読み取り】
// この家計簿から出力したCSVを、収支履歴へ変換します。

import { initialCategories } from "../categories";
import { initialPaymentMethods } from "../paymentMethods";
import type { Transaction } from "../types";

function parseCsvRows(csvText: string) {
    const rows: string[][] = [];
    let row: string[] = [];
    let cell = "";
    let insideQuotes = false;

    for (let index = 0; index < csvText.length; index += 1) {
        const character = csvText[index];
        const nextCharacter = csvText[index + 1];

        if (character === '"') {
            if (insideQuotes && nextCharacter === '"') {
                cell += '"';
                index += 1;
            } else {
                insideQuotes = !insideQuotes;
            }
        } else if (character === "," && !insideQuotes) {
            row.push(cell);
            cell = "";
        } else if (
            (character === "\n" || character === "\r") &&
            !insideQuotes
        ) {
            if (character === "\r" && nextCharacter === "\n") {
                index += 1;
            }

            row.push(cell);

            if (row.some((value) => value !== "")) {
                rows.push(row);
            }

            row = [];
            cell = "";
        } else {
            cell += character;
        }
    }

    row.push(cell);

    if (row.some((value) => value !== "")) {
        rows.push(row);
    }

    return rows;
}

export async function readTransactionsCsv(file: File) {
    const csvText = await file.text();
    const rows = parseCsvRows(csvText.replace(/^\uFEFF/, ""));
    const [header, ...dataRows] = rows;

    const expectedHeader = [
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

    if (
        !header ||
        expectedHeader.some(
            (name, index) => header[index] !== name,
        )
    ) {
        throw new Error("CSVの項目が正しくありません。");
    }

    return dataRows.map((values, index): Transaction => {
        const [
            date,
            typeName,
            amount,
            majorCategoryName,
            minorCategoryName,
            source,
            memo,
            paymentMethodName,
            scopeName,
        ] = values;

        const type =
            typeName === "収入"
                ? "income"
                : typeName === "支出"
                    ? "expense"
                    : "";

        const majorCategory = initialCategories.find(
            (category) =>
                category.name === majorCategoryName &&
                category.type === type &&
                category.parentId === null,
        );

        const minorCategory = initialCategories.find(
            (category) =>
                category.name === minorCategoryName &&
                category.parentId === majorCategory?.id,
        );

        const paymentMethod = initialPaymentMethods.find(
            (method) => method.name === paymentMethodName,
        );

        const lineNumber = index + 2;

        if (!date) {
            throw new Error(
                `${lineNumber}行目の日付が空欄です。`,
            );
        }

        if (!type) {
            throw new Error(
                `${lineNumber}行目の種類を確認してください。`,
            );
        }

        if (
            !amount ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0
        ) {
            throw new Error(
                `${lineNumber}行目の金額を確認してください。`,
            );
        }

        if (!majorCategory) {
            throw new Error(
                `${lineNumber}行目の大カテゴリを確認してください。`,
            );
        }

        return {
            id: crypto.randomUUID(),
            date,
            type,
            amount,
            majorCategoryId: majorCategory.id,
            minorCategoryId: minorCategory?.id ?? "",
            source: source ?? "",
            memo: memo ?? "",
            paymentMethodId: paymentMethod?.id ?? "",
            scope: scopeName === "共有" ? "shared" : "personal",
        };
    });
}