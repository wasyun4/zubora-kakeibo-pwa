// 【家計簿期間の計算】
// 表示月と月初め日から、集計の開始日・終了日を計算します。

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export function getAccountingPeriod(
    selectedMonth: string,
    monthStartDay: string,
) {
    if (!selectedMonth) return null;

    const [year, month] = selectedMonth
        .split("-")
        .map(Number);
    const startDay = Number(monthStartDay);

    const startDate =
        startDay === 1
            ? new Date(year, month - 1, 1)
            : new Date(year, month - 2, startDay);

    const endDate =
        startDay === 1
            ? new Date(year, month, 0)
            : new Date(year, month - 1, startDay - 1);

    return {
        start: formatDate(startDate),
        end: formatDate(endDate),
        label: `${startDate.getMonth() + 1}/${startDate.getDate()}〜${endDate.getMonth() + 1}/${endDate.getDate()}`,
    };
}