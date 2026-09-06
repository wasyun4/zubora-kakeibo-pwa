// 【表示月の選択】
// 表示対象の月を選択し、選ばれた年月をApp.tsxへ伝える部品です。

type MonthFilterProps = {
    selectedMonth: string;
    monthStartDay: string;
    onMonthChange: (month: string) => void;
};

function MonthFilter({
    selectedMonth,
    monthStartDay,
    onMonthChange,
}: MonthFilterProps) {
    const periodText = (() => {
        if (!selectedMonth) return "";

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

        return `${startDate.getMonth() + 1}/${startDate.getDate()}〜${endDate.getMonth() + 1}/${endDate.getDate()}`;
    })();
    return (
        <label className="month-filter">
            <span>表示月</span>

            <input
                type="month"
                aria-label="表示する月"
                value={selectedMonth}
                onChange={(event) =>
                    onMonthChange(event.target.value)
                }
            />
            {periodText && <span>対象期間：{periodText}</span>}
        </label>
    );
}

export default MonthFilter;
