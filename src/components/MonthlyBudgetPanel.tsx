// 【月間生活費予算】
// 月全体の予算入力と保存操作、使用率、残り予算を表示する部品です。

type MonthlyBudgetPanelProps = {
    selectedMonth: string;
    budgetAmount: string;
    savedBudgetAmount: number | null;
    remainingBudget: number | null;
    onBudgetAmountChange: (value: string) => void;
    onSave: () => void;
};

function MonthlyBudgetPanel({
    selectedMonth,
    budgetAmount,
    savedBudgetAmount,
    remainingBudget,
    onBudgetAmountChange,
    onSave,
}: MonthlyBudgetPanelProps) {

    const usagePercentage =
        savedBudgetAmount !== null && remainingBudget !== null
            ? Math.round(
                ((savedBudgetAmount - remainingBudget) / savedBudgetAmount) * 100,
            )
            : 0;

    return (
        <section>
            <h2>月の生活費予算</h2>

            {selectedMonth === "" ? (
                <p>予算を設定する月を選択してください。</p>
            ) : (
                <>
                    <label>
                        予算金額
                        <input
                            type="number"
                            placeholder="例：100000"
                            value={budgetAmount}
                            onChange={(event) =>
                                onBudgetAmountChange(event.target.value)
                            }
                        />
                    </label>

                    <button onClick={onSave}>予算を保存する</button>

                    {savedBudgetAmount === null ||
                        remainingBudget === null ? (
                        <p>この月の予算は未設定です。</p>
                    ) : (
                        <>
                            <p>設定予算：{savedBudgetAmount}円</p>

                            <div className="budget-heading">
                                <span>予算の使用率</span>
                                <strong>{usagePercentage}%</strong>
                            </div>

                            <div className="budget-progress">
                                <div
                                    className="budget-progress-bar"
                                    style={{
                                        width: `${Math.min(usagePercentage, 100)}%`,
                                    }}
                                />
                            </div>

                            {remainingBudget >= 0 ? (
                                <p>残り予算：{remainingBudget}円</p>
                            ) : (
                                <p>
                                    予算オーバー：
                                    {Math.abs(remainingBudget)}円
                                </p>
                            )}
                        </>
                    )}
                </>
            )}
        </section>
    );
}

export default MonthlyBudgetPanel;
