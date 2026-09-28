// 【IndexedDBの準備】
// 家計簿データを端末内のデータベースへ保存するための土台です。

import { openDB, type DBSchema } from "idb";
import type {
    CategoryBudget,
    MonthlyBudget,
    Receipt,
    ReceiptItem,
    Transaction,
    WalletData,
} from "../types";
import { emptyWalletData, walletIds } from "./wallets";
import { initialCategories, type Category } from "../categories";
import { isCategoryArray } from "./categoryManagement";

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
    receipts: {
        key: string;
        value: Receipt;
    };
    receiptItems: {
        key: string;
        value: ReceiptItem;
    };
}

export const databasePromise = openDB<KakeiboDatabase>(
    "zubora-kakeibo",
    2,
    {
        upgrade(database) {
            if (!database.objectStoreNames.contains("transactions")) {
                database.createObjectStore("transactions", { keyPath: "id" });
            }
            if (!database.objectStoreNames.contains("monthlyBudgets")) {
                database.createObjectStore("monthlyBudgets", { keyPath: "month" });
            }
            if (!database.objectStoreNames.contains("categoryBudgets")) {
                database.createObjectStore("categoryBudgets", { keyPath: ["month", "majorCategoryId"] });
            }
            if (!database.objectStoreNames.contains("settings")) {
                database.createObjectStore("settings");
            }
            if (!database.objectStoreNames.contains("receipts")) {
                database.createObjectStore("receipts", { keyPath: "id" });
            }
            if (!database.objectStoreNames.contains("receiptItems")) {
                database.createObjectStore("receiptItems", { keyPath: "id" });
            }
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

// 【レシート本体の読み込み・保存】
export async function loadReceipts() {
    const database = await databasePromise;
    return database.getAll("receipts");
}

export async function saveReceipts(receipts: Receipt[]) {
    const database = await databasePromise;
    const databaseTransaction = database.transaction("receipts", "readwrite");
    await databaseTransaction.store.clear();
    for (const receipt of receipts) {
        await databaseTransaction.store.put(receipt);
    }
    await databaseTransaction.done;
}

// 【レシート商品明細の読み込み・保存】
export async function loadReceiptItems() {
    const database = await databasePromise;
    return database.getAll("receiptItems");
}

export async function saveReceiptItems(items: ReceiptItem[]) {
    const database = await databasePromise;
    const databaseTransaction = database.transaction("receiptItems", "readwrite");
    await databaseTransaction.store.clear();
    for (const item of items) {
        await databaseTransaction.store.put(item);
    }
    await databaseTransaction.done;
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
        const savedCardSettings = parsed.creditCardSettings;
        const creditCardSettings =
            savedCardSettings &&
                Number.isInteger(savedCardSettings.closingDay) &&
                savedCardSettings.closingDay >= 1 &&
                savedCardSettings.closingDay <= 31 &&
                Number.isInteger(savedCardSettings.paymentDay) &&
                savedCardSettings.paymentDay >= 1 &&
                savedCardSettings.paymentDay <= 31 &&
                walletIds.includes(savedCardSettings.paymentWalletId) &&
                savedCardSettings.paymentWalletId !== "creditCard"
                ? savedCardSettings
                : emptyWalletData.creditCardSettings;
        return {
            openingBalances,
            transfers: Array.isArray(parsed.transfers) ? parsed.transfers : [],
            creditCardSettings,
        };
    } catch {
        return emptyWalletData;
    }
}

export async function saveWalletData(data: WalletData) {
    const database = await databasePromise;
    await database.put("settings", JSON.stringify(data), "walletData");
}

// 【カテゴリ設定の読み込み・保存】
export async function loadCategories(): Promise<Category[]> {
    const database = await databasePromise;
    const saved = await database.get("settings", "categories");

    if (!saved) return initialCategories.map((category) => ({ ...category }));

    try {
        const parsed: unknown = JSON.parse(saved);
        return isCategoryArray(parsed)
            ? parsed
            : initialCategories.map((category) => ({ ...category }));
    } catch {
        return initialCategories.map((category) => ({ ...category }));
    }
}

export async function saveCategories(categories: Category[]) {
    const database = await databasePromise;
    await database.put("settings", JSON.stringify(categories), "categories");
}
