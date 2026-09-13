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