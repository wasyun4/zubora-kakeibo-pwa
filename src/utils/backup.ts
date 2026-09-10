// 【バックアップファイルの作成】
// localStorageの家計簿データをJSONファイルとして保存します。

export function downloadBackup() {
    const backupData = {
        version: 1,
        exportedAt: new Date().toISOString(),
        data: {
            expenses: JSON.parse(
                localStorage.getItem("expenses") ?? "[]",
            ),
            monthlyBudgets: JSON.parse(
                localStorage.getItem("monthlyBudgets") ?? "[]",
            ),
            categoryBudgets: JSON.parse(
                localStorage.getItem("categoryBudgets") ?? "[]",
            ),
            monthStartDay:
                localStorage.getItem("monthStartDay") ?? "1",
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