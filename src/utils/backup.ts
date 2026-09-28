// 【バックアップファイルの作成】
// IndexedDBの家計簿データをJSONファイルとして保存します。

import {
    loadCategoryBudgets,
    loadCategories,
    loadMonthlyBudgets,
    loadReceipts,
    loadReceiptItems,
    loadMonthStartDay,
    loadTransactions,
    loadWalletData,
    saveCategoryBudgets,
    saveCategories,
    saveMonthlyBudgets,
    saveReceipts,
    saveReceiptItems,
    saveMonthStartDay,
    saveTransactions,
    saveWalletData,
} from "./database";
import { emptyWalletData, walletIds } from "./wallets";
import { initialCategories, type Category } from "../categories";
import { isCategoryArray } from "./categoryManagement";

import type {
    CategoryBudget,
    MonthlyBudget,
    Receipt,
    ReceiptItem,
    Transaction,
    WalletData,
} from "../types";

export async function downloadBackup() {
    const [
        expenses,
        monthlyBudgets,
        categoryBudgets,
        savedMonthStartDay,
        walletData,
        categories,
        receipts,
        receiptItems,
    ] = await Promise.all([
        loadTransactions(),
        loadMonthlyBudgets(),
        loadCategoryBudgets(),
        loadMonthStartDay(),
        loadWalletData(),
        loadCategories(),
        loadReceipts(),
        loadReceiptItems(),
    ]);

    const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            expenses,
            monthlyBudgets,
            categoryBudgets,
            monthStartDay: savedMonthStartDay ?? "1",
            walletData,
            categories,
            receipts,
            receiptItems,
        },
    };

    const fileContent = JSON.stringify(
        backupData,
        null,
        2,
    );

    const file = new Blob([fileContent], {
        type: "application/json",
    });

    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);

    link.href = downloadUrl;
    link.download = `kakeibo-backup-${today}.json`;
    link.click();

    URL.revokeObjectURL(downloadUrl);
}

// 【バックアップファイルからの復元】
// JSONファイルを確認し、IndexedDBへ家計簿データを戻します。

export async function restoreBackup(file: File) {
    const fileContent = await file.text();

    const backupData = JSON.parse(fileContent) as {
        version?: number;
        data?: {
            expenses?: unknown[];
            monthlyBudgets?: unknown[];
            categoryBudgets?: unknown[];
            monthStartDay?: string;
            walletData?: unknown;
            categories?: unknown;
            receipts?: unknown[];
            receiptItems?: unknown[];
        };
    };

    const data = backupData.data;

    if (
        backupData.version !== 1 ||
        !data ||
        !Array.isArray(data.expenses) ||
        !Array.isArray(data.monthlyBudgets) ||
        !Array.isArray(data.categoryBudgets) ||
        typeof data.monthStartDay !== "string"
    ) {
        throw new Error("使用できないバックアップファイルです。");
    }

    const shouldRestore = window.confirm(
        "現在のデータをバックアップ内容で置き換えます。よろしいですか？",
    );

    if (!shouldRestore) {
        return false;
    }

    let walletData: WalletData = emptyWalletData;
    if (data.walletData !== undefined) {
        const candidate = data.walletData as Partial<WalletData>;
        if (!candidate || typeof candidate !== "object" ||
            !candidate.openingBalances || !Array.isArray(candidate.transfers) ||
            walletIds.some((id) => {
                const amount = candidate.openingBalances?.[id];
                // りそな追加前のバックアップには、この開始額がありません。
                if (id === "bankAccountRisona" && amount === undefined) return false;
                return typeof amount !== "number" || !Number.isFinite(amount) || amount < 0;
            }) ||
            candidate.transfers.some((transfer) =>
                !transfer || typeof transfer.id !== "string" || typeof transfer.date !== "string" ||
                !walletIds.includes(transfer.from) || !walletIds.includes(transfer.to) ||
                transfer.from === "creditCard" || transfer.from === transfer.to ||
                typeof transfer.amount !== "number" || !Number.isFinite(transfer.amount) || transfer.amount <= 0)) {
            throw new Error("ウォレットデータを読み込めません。");
        }
        walletData = {
            openingBalances: {
                ...emptyWalletData.openingBalances,
                ...candidate.openingBalances,
            },
            transfers: candidate.transfers,
            creditCardSettings:
                candidate.creditCardSettings &&
                    Number.isInteger(candidate.creditCardSettings.closingDay) &&
                    candidate.creditCardSettings.closingDay >= 1 &&
                    candidate.creditCardSettings.closingDay <= 31 &&
                    Number.isInteger(candidate.creditCardSettings.paymentDay) &&
                    candidate.creditCardSettings.paymentDay >= 1 &&
                    candidate.creditCardSettings.paymentDay <= 31 &&
                    walletIds.includes(candidate.creditCardSettings.paymentWalletId) &&
                    candidate.creditCardSettings.paymentWalletId !== "creditCard"
                    ? candidate.creditCardSettings
                    : emptyWalletData.creditCardSettings,
        };
    }

    const categories: Category[] = data.categories === undefined
        ? initialCategories.map((category) => ({ ...category }))
        : isCategoryArray(data.categories)
            ? data.categories
            : (() => { throw new Error("カテゴリデータを読み込めません。"); })();

    const receipts = data.receipts ?? [];
    const receiptItems = data.receiptItems ?? [];

    if (!Array.isArray(receipts) || !Array.isArray(receiptItems)) {
        throw new Error("レシートデータを読み込めません。");
    }

    await Promise.all([
        saveTransactions(data.expenses as Transaction[]),
        saveMonthlyBudgets(
            data.monthlyBudgets as MonthlyBudget[],
        ),
        saveCategoryBudgets(
            data.categoryBudgets as CategoryBudget[],
        ),
        saveMonthStartDay(data.monthStartDay),
        saveWalletData(walletData),
        saveCategories(categories),
        saveReceipts(receipts as Receipt[]),
        saveReceiptItems(receiptItems as ReceiptItem[]),
    ]);

    return true;
}
