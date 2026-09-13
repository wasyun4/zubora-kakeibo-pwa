// 【バックアップファイルの作成】
// IndexedDBの家計簿データをJSONファイルとして保存します。

import {
    loadCategoryBudgets,
    loadMonthlyBudgets,
    loadMonthStartDay,
    loadTransactions,
} from "./database";

export async function downloadBackup() {
    const [
        expenses,
        monthlyBudgets,
        categoryBudgets,
        savedMonthStartDay,
    ] = await Promise.all([
        loadTransactions(),
        loadMonthlyBudgets(),
        loadCategoryBudgets(),
        loadMonthStartDay(),
    ]);

    const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            expenses,
            monthlyBudgets,
            categoryBudgets,
            monthStartDay: savedMonthStartDay ?? "1",
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
// JSONファイルを確認し、localStorageへ家計簿データを戻します。

export async function restoreBackup(file: File) {
    const fileContent = await file.text();

    const backupData = JSON.parse(fileContent) as {
        version?: number;
        data?: {
            expenses?: unknown[];
            monthlyBudgets?: unknown[];
            categoryBudgets?: unknown[];
            monthStartDay?: string;
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

    localStorage.setItem(
        "expenses",
        JSON.stringify(data.expenses),
    );
    localStorage.setItem(
        "monthlyBudgets",
        JSON.stringify(data.monthlyBudgets),
    );
    localStorage.setItem(
        "categoryBudgets",
        JSON.stringify(data.categoryBudgets),
    );
    localStorage.setItem(
        "monthStartDay",
        data.monthStartDay,
    );

    return true;
}