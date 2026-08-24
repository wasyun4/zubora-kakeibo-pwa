type MonthFilterProps = {
    selectedMonth: string;
    onMonthChange: (month: string) => void;
};

function MonthFilter({
    selectedMonth,
    onMonthChange,
}: MonthFilterProps) {
    return (
        <label>
            表示する月
            <input
                type="month"
                value={selectedMonth}
                onChange={(event) =>
                    onMonthChange(event.target.value)
                }
            />
        </label>
    );
}

export default MonthFilter;