// 【IndexedDBの準備】
// 家計簿データを端末内のデータベースへ保存するための土台です。

import { openDB, type DBSchema } from "idb";
import type {
    CategoryBudget,
    MonthlyBudget,
    Transaction,
    WalletData,
} from "../types";
import { emptyWalletData, walletIds } from "./wallets";

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

// 【月予算の読み込み】
export async function loadMonthlyBudgets() {
    const database = await databasePromise;
    return database.getAll("monthlyBudgets");
}

// 【月予算の保存】
export async function saveMonthlyBudgets(
    monthlyBudgets: MonthlyBudget[],
) {
    const database = await databasePromise;
    const databaseTransaction = database.transaction(
        "monthlyBudgets",
        "readwrite",
    );

    await databaseTransaction.store.clear();

    for (const monthlyBudget of monthlyBudgets) {
        await databaseTransaction.store.put(monthlyBudget);
    }

    await databaseTransaction.done;
}

// 【カテゴリ予算の読み込み】
export async function loadCategoryBudgets() {
    const database = await databasePromise;
    return database.getAll("categoryBudgets");
}

// 【カテゴリ予算の保存】
export async function saveCategoryBudgets(
    categoryBudgets: CategoryBudget[],
) {
    const database = await databasePromise;
    const databaseTransaction = database.transaction(
        "categoryBudgets",
        "readwrite",
    );

    await databaseTransaction.store.clear();

    for (const categoryBudget of categoryBudgets) {
        await databaseTransaction.store.put(categoryBudget);
    }

    await databaseTransaction.done;
}

// 【月初め日の読み込み】
export async function loadMonthStartDay() {
    const database = await databasePromise;
    return database.get("settings", "monthStartDay");
}

// 【月初め日の保存】
export async function saveMonthStartDay(monthStartDay: string) {
    const database = await databasePromise;
    await database.put(
        "settings",
        monthStartDay,
        "monthStartDay",
    );
}

// 【ウォレット設定と資金移動】
export async function loadWalletData(): Promise<WalletData> {
    const database = await databasePromise;
    const saved = await database.get("settings", "walletData");
    if (!saved) return emptyWalletData;

    try {
        const parsed = JSON.parse(saved) as Partial<WalletData>;
        const openingBalances = { ...emptyWalletData.openingBalances };
        for (const id of walletIds) {
            const amount = parsed.openingBalances?.[id];
            if (typeof amount === "number" && Number.isFinite(amount) && amount >= 0) {
                openingBalances[id] = amount;
            }
        }
        return {
            openingBalances,
            transfers: Array.isArray(parsed.transfers) ? parsed.transfers : [],
        };
    } catch {
        return emptyWalletData;
    }
}

export async function saveWalletData(data: WalletData) {
    const database = await databasePromise;
    await database.put("settings", JSON.stringify(data), "walletData");
}
