// 【表示月の選択】
// 表示対象の月を選択し、選ばれた年月をApp.tsxへ伝える部品です。

type MonthFilterProps = {
    selectedMonth: string;
    onMonthChange: (month: string) => void;
};

function MonthFilter({
    selectedMonth,
    onMonthChange,
}: MonthFilterProps) {
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
        </label>
    );
}

export default MonthFilter;
