// 【バックアップファイルの作成】
// IndexedDBの家計簿データをJSONファイルとして保存します。

import {
    loadCategoryBudgets,
    loadMonthlyBudgets,
    loadMonthStartDay,
    loadTransactions,
    loadWalletData,
    saveCategoryBudgets,
    saveMonthlyBudgets,
    saveMonthStartDay,
    saveTransactions,
    saveWalletData,
} from "./database";
import { emptyWalletData, walletIds } from "./wallets";

import type {
    CategoryBudget,
    MonthlyBudget,
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
    ] = await Promise.all([
        loadTransactions(),
        loadMonthlyBudgets(),
        loadCategoryBudgets(),
        loadMonthStartDay(),
        loadWalletData(),
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
        };
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
    ]);

    return true;
}
