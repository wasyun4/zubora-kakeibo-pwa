// 【表示月の選択】
// 表示対象の月を選択し、選ばれた年月をApp.tsxへ伝える部品です。

import { getAccountingPeriod } from "../utils/accountingPeriod";

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
    const period = getAccountingPeriod(
        selectedMonth,
        monthStartDay,
    );
    return (
        <div className="month-filter">
            <input
                type="month"
                aria-label="表示する月"
                value={selectedMonth}
                onChange={(event) =>
                    onMonthChange(event.target.value)
                }
            />
            {period && (
                <span className="month-filter-period" aria-live="polite">
                    対象期間：{period.label}
                </span>
            )}
        </div>
    );
}

export default MonthFilter;
