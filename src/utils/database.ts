// 【IndexedDBの準備】
// 家計簿データを端末内のデータベースへ保存するための土台です。

import { openDB, type DBSchema } from "idb";
import type {
    CategoryBudget,
    MonthlyBudget,
    Transaction,
} from "../types";

interface KakeiboDatabase extends DBSchema {
    transactions: {
        key: string;
        value: Transaction;
    };
    monthlyBudgets: {
        key: string;
        value: MonthlyBudget;
    };
    categoryBudgets: {
        key: [string, string];
        value: CategoryBudget;
    };
    settings: {
        key: string;
        value: string;
    };
}

export const databasePromise = openDB<KakeiboDatabase>(
    "zubora-kakeibo",
    1,
    {
        upgrade(database) {
            database.createObjectStore("transactions", {
                keyPath: "id",
            });

            database.createObjectStore("monthlyBudgets", {
                keyPath: "month",
            });

            database.createObjectStore("categoryBudgets", {
                keyPath: ["month", "majorCategoryId"],
            });

            database.createObjectStore("settings");
        },
    },
);

// 【収支履歴の読み込み】
export async function loadTransactions() {
    const database = await databasePromise;
    return database.getAll("transactions");
}

// 【収支履歴の保存】
export async function saveTransactions(
    transactions: Transaction[],
) {
    const database = await databasePromise;
    const databaseTransaction = database.transaction(
        "transactions",
        "readwrite",
    );

    await databaseTransaction.store.clear();

    for (const transaction of transactions) {
        await databaseTransaction.store.put(transaction);
    }

    await databaseTransaction.done;
}